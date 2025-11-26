import { GoogleGenAI } from "@google/genai";
import { PDFParse } from "pdf-parse";

import { AICache } from "../models/aiCache.model.js";
import { createCacheHash } from "../utils/cacheHash.js";

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeResume = async (req, res) => {
  try {
    console.log("📥 AI ANALYZER Body:", req.body);

    const { jobDescription, isUrl } = req.body;

    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    let resumeText = "";

    // ======================================================
    // 1️⃣ Extract Resume Text (URL or File)
    // ======================================================
    if (isUrl === "true") {
      const resumeUrl = req.body.resume;
      if (!resumeUrl) {
        return res.status(400).json({
          success: false,
          message: "Resume URL missing",
        });
      }

      const resp = await fetch(resumeUrl);
      if (!resp.ok) {
        return res.status(400).json({
          success: false,
          message: "Invalid resume URL",
        });
      }

      const pdfBuffer = Buffer.from(await resp.arrayBuffer());
      const parser = new PDFParse({ data: pdfBuffer });
      const parsed = await parser.getText();
      await parser.destroy();

      resumeText = parsed.text || "";
    } else {
      const file = req.files?.resume?.[0];

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "Resume file missing",
        });
      }

      const parser = new PDFParse({ data: file.buffer });
      const parsed = await parser.getText();
      await parser.destroy();

      resumeText = parsed.text || "";
    }

    if (!resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract text from resume",
      });
    }

    console.log("🔍 Extracted Resume Length:", resumeText.length);

    // ======================================================
    // 2️⃣ Create Cache Hash
    // ======================================================
    const userId = req.user?._id?.toString() || "guest";
    const hash = createCacheHash(resumeText, jobDescription, userId);

    // ======================================================
    // 3️⃣ Check Cache
    // ======================================================
    const cached = await AICache.findOne({ hash });

    if (cached) {
      console.log("⚡ Returning Cached AI Result");
      return res.status(200).json({
        success: true,
        cached: true,
        data: cached.result,
      });
    }

    // ======================================================
    // 4️⃣ Call Gemini 2.5 Flash
    // ======================================================
    let aiResponse;

    try {
      aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
          Compare the resume vs job description.
          Return ONLY valid JSON in this exact format:

          {
            "matchPercentage": "",
            "missingSkills": [],
            "strengths": [],
            "roadmap": [],
            "resumeRewrite": ""
          }

          RESUME:
          ${resumeText}

          JOB DESCRIPTION:
          ${jobDescription}
        `,
      });
    } catch (err) {
      console.error("❌ Gemini API Error:", err);
      return res.status(500).json({
        success: false,
        message: "Gemini AI request failed",
        error: err.message,
      });
    }

    // ======================================================
    // 5️⃣ Extract Raw AI Output
    // ======================================================
    let output =
      aiResponse.text ||
      aiResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
      null;

    if (!output) {
      return res.status(500).json({
        success: false,
        message: "AI returned no readable text",
        aiResponse,
      });
    }

    // Remove ```json code block markers
    const clean = output.replace(/```json|```/g, "").trim();

    // ======================================================
    // 6️⃣ Parse JSON Safely
    // ======================================================
    let json;
    try {
      json = JSON.parse(clean);
    } catch (err) {
      console.error("❌ JSON PARSE ERROR:", clean);
      return res.status(500).json({
        success: false,
        message: "Invalid JSON returned from AI",
        raw: clean,
      });
    }

    // ======================================================
    // 7️⃣ Save Result To Cache
    // ======================================================
    await AICache.create({
      userId,
      hash,
      result: json,
    });

    // ======================================================
    // 8️⃣ Send AI Analysis
    // ======================================================
    return res.status(200).json({
      success: true,
      cached: false,
      data: json,
    });
  } catch (error) {
    console.log("🔥 UNEXPECTED AI ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
      error: error.message,
    });
  }
};
