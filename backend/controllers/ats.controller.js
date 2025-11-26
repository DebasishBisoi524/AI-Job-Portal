import { GoogleGenAI } from "@google/genai";
import { PDFParse } from "pdf-parse";

import { ATSAICache } from "../models/atsAICache.model.js";
import { createCacheHash } from "../utils/cacheHash.js";

// Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const getATSScore = async (req, res) => {
  try {
    console.log("📥 ATS Body:", req.body);

    const { jobDescription, isUrl } = req.body;

    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    let resumeText = "";

    // 1️⃣ Extract Resume (URL or File)
    if (isUrl === "true") {
      const resumeUrl = req.body.resume;

      if (!resumeUrl) {
        return res.status(400).json({
          success: false,
          message: "Resume URL is required",
        });
      }

      const resp = await fetch(resumeUrl);
      if (!resp.ok) {
        return res.status(400).json({
          success: false,
          message: "Invalid resume URL",
        });
      }

      const buffer = Buffer.from(await resp.arrayBuffer());

      const parser = new PDFParse({ data: buffer });
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
        message: "Could not extract text from resume",
      });
    }

    console.log("🔍 Extracted Resume Length:", resumeText.length);

    // 2️⃣ Create Cache Hash

    const userId = req.user?._id?.toString() || "guest";
    const hash = createCacheHash(resumeText, jobDescription, userId);

    // 3️⃣ Check Cache
    const cached = await ATSAICache.findOne({ hash });

    if (cached) {
      console.log("⚡ Returning Cached ATS Result");
      return res.status(200).json({
        success: true,
        cached: true,
        data: cached.result,
      });
    }

    // 4️⃣ Call Gemini ATS Engine
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are an ATS engine. Compare resume vs job description.
        Return JSON ONLY in this structure:

        {
          "atsScore": 0,
          "keywordMatch": [],
          "missingKeywords": [],
          "suggestions": [],
          "summary": ""
        }

        RESUME:
        ${resumeText}

        JOB DESCRIPTION:
        ${jobDescription}
      `,
    });

    let output =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      null;

    if (!output) {
      return res.status(500).json({
        success: false,
        message: "AI returned no readable content",
        response,
      });
    }

    // Clean markdown ```json
    const clean = output.replace(/```json|```/g, "").trim();

    // 5️⃣ Parse JSON
    let json;
    try {
      json = JSON.parse(clean);
    } catch (err) {
      console.log("❌ JSON Parse Error:", clean);
      return res.status(500).json({
        success: false,
        message: "Invalid JSON from AI",
        raw: clean,
      });
    }

    // 6️⃣ Save To Cache

    await ATSAICache.create({
      userId,
      hash,
      result: json,
    });

    // 7️⃣ Send Response
    return res.status(200).json({
      success: true,
      cached: false,
      data: json,
    });
  } catch (error) {
    console.log("🔥 ATS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "ATS processing failed",
      error: error.message,
    });
  }
};
