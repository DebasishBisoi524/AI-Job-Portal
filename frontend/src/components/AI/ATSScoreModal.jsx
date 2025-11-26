import React, { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { AI_ATS_API_END_POINT } from "@/utils/constant";

// GSAP + Plugins
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const ATSScoreModal = ({ open, setOpen }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [showAnimation, setShowAnimation] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const [typed, setTyped] = useState({
    atsScore: "",
    missingKeywords: "",
    suggestions: "",
    summary: "",
    keywordMatch: [],
  });

  const textRef = useRef(null);
  const emojiRef = useRef(null);
  const gsapAnimationsRef = useRef(null); // Store animations in ref

  const loadingTexts = [
    "📄 Got the file...",
    "🔍 Parsing the resume...",
    "🧠 Extracting details...",
    "🤖 Analyzing ATS patterns...",
    "📊 Calculating match score...",
    "✨ Finalizing ATS report...",
  ];

  // ---------------------------------------------------------------------------
  // CLEANUP ON UNMOUNT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      // Kill all animations on unmount
      if (gsapAnimationsRef.current) {
        gsapAnimationsRef.current.tl?.kill();
        gsapAnimationsRef.current.float?.kill();
        gsapAnimationsRef.current.emojiBounce?.kill();
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // TYPEWRITER
  // ---------------------------------------------------------------------------
  const typeWriter = (key, text, speed = 10) => {
    return new Promise((resolve) => {
      let i = 0;

      const reveal = () => {
        setTyped((prev) => ({
          ...prev,
          [key]: Array.isArray(text) ? text.slice(0, i) : text.slice(0, i),
        }));

        i++;

        if (i <= text.length) {
          setTimeout(reveal, speed);
        } else {
          resolve();
        }
      };

      reveal();
    });
  };

  // ---------------------------------------------------------------------------
  // GSAP LOADING ANIMATION
  // ---------------------------------------------------------------------------
  const startGSAPAnimation = () => {
    setShowAnimation(true);
    setCurrentTextIndex(0);

    // Use setTimeout to ensure refs are mounted
    setTimeout(() => {
      if (!textRef.current || !emojiRef.current) {
        console.error("Refs not available for GSAP animation");
        return;
      }

      // Reset any existing animations
      gsap.killTweensOf([textRef.current, emojiRef.current]);

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.2,
      });

      // Floating animation
      const float = gsap.to(textRef.current, {
        x: "+=8",
        y: "+=5",
        duration: 1.3,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Emoji bounce
      const emojiBounce = gsap.to(emojiRef.current, {
        scale: 1.15,
        duration: 0.6,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Loop text (slide up)
      loadingTexts.forEach((_, index) => {
        tl.to(textRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.35,
        })
          .call(() => {
            setCurrentTextIndex(index);
          })
          .fromTo(
            textRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.35 }
          )
          .to(textRef.current, {
            opacity: 1,
            duration: 0.8,
          });
      });

      // Store animations in ref
      gsapAnimationsRef.current = { tl, float, emojiBounce };
    }, 50);
  };

  // ---------------------------------------------------------------------------
  // STOP GSAP ANIMATION
  // ---------------------------------------------------------------------------
  const stopGSAPAnimation = () => {
    if (gsapAnimationsRef.current) {
      gsapAnimationsRef.current.tl?.kill();
      gsapAnimationsRef.current.float?.kill();
      gsapAnimationsRef.current.emojiBounce?.kill();
      gsapAnimationsRef.current = null;
    }
    setShowAnimation(false);
  };

  // ---------------------------------------------------------------------------
  // ANALYZE ATS
  // ---------------------------------------------------------------------------
  const analyzeATS = async () => {
    if (!resumeFile) return toast.error("Please upload your resume (PDF)");
    if (!jobDescription.trim())
      return toast.error("Please enter job description");

    try {
      setLoading(true);
      setResult(null);

      setTyped({
        atsScore: "",
        missingKeywords: "",
        suggestions: "",
        summary: "",
        keywordMatch: [],
      });

      // Start GSAP loading animation
      startGSAPAnimation();

      const form = new FormData();
      form.append("resume", resumeFile);
      form.append("jobDescription", jobDescription);
      form.append("isUrl", "false");

      const res = await axios.post(
        `${AI_ATS_API_END_POINT}/ai/check-ats-score`,
        form,
        { withCredentials: true }
      );

      const data = res.data.data;

      // Stop GSAP animations
      stopGSAPAnimation();

      setResult(data);

      // Typing output
      await typeWriter("atsScore", data.atsScore + "%");
      await typeWriter("missingKeywords", data.missingKeywords.join(", "));
      await typeWriter("suggestions", data.suggestions.join("\n\n"));
      await typeWriter("summary", data.summary);
      await typeWriter("keywordMatch", data.keywordMatch);
    } catch (err) {
      console.error("ATS Error:", err);
      toast.error("ATS analysis failed.");
      stopGSAPAnimation();
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />

        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 
          w-[90%] max-w-lg 
          max-h-[80vh] overflow-y-auto scrollbar-hide
          -translate-x-1/2 -translate-y-1/2
          bg-white rounded-2xl p-7 shadow-xl border border-gray-200"
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>

          <Dialog.Title className="text-2xl font-bold text-gray-900 mb-5">
            ATS Score Checker
          </Dialog.Title>

          {/* ------------------------------------------------------------------- */}
          {/* LOADING ANIMATION */}
          {/* ------------------------------------------------------------------- */}
          {showAnimation && (
            <div
              style={{
                height: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <div
                ref={textRef}
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span ref={emojiRef}>
                  {loadingTexts[currentTextIndex].split(" ")[0]}
                </span>
                <span>
                  {loadingTexts[currentTextIndex].split(" ").slice(1).join(" ")}
                </span>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* FORM (HIDDEN WHEN LOADING) */}
          {/* ------------------------------------------------------------------- */}
          {!showAnimation && !result && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-gray-900 font-semibold">
                  Upload Resume
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="mt-3 border border-gray-300 p-2 rounded-lg w-full bg-white text-gray-800"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-gray-900 font-semibold">
                  Paste Job Description
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg w-full bg-white text-gray-800 mt-2"
                  placeholder="Paste job description here..."
                />
              </div>

              <button
                onClick={analyzeATS}
                disabled={loading}
                className="w-full bg-[#6f3edb] hover:bg-[#5b2ec9] 
                text-white font-semibold py-3 rounded-xl transition"
              >
                {loading ? "Analyzing..." : "Run ATS Analysis"}
              </button>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* RESULTS */}
          {/* ------------------------------------------------------------------- */}
          {result && !showAnimation && (
            <div className="mt-7 space-y-5 text-gray-900 pb-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-semibold text-[#6f3edb]">ATS Score</h2>
                <p className="text-3xl font-bold">{typed.atsScore}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-semibold text-[#6f3edb]">
                  Missing Keywords
                </h2>
                <p>{typed.missingKeywords}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-semibold text-[#6f3edb]">Suggestions</h2>
                <pre className="whitespace-pre-wrap">{typed.suggestions}</pre>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-semibold text-[#6f3edb]">Summary</h2>
                <p>{typed.summary}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-semibold text-[#6f3edb]">Keyword Match</h2>
                {typed.keywordMatch.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {typed.keywordMatch.map((kw, i) => (
                      <li key={i}>{kw}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 italic">
                    No direct keyword matches found.
                  </p>
                )}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ATSScoreModal;
