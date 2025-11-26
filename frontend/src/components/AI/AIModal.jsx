import React, { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Upload } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { AI_API_END_POINT } from "@/utils/constant";

// GSAP + Plugins
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const AIModal = ({ open, setOpen, resumeUrl, jobDescription }) => {
  const [mode, setMode] = useState("profile");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [typedOutput, setTypedOutput] = useState({});

  const [showAnimation, setShowAnimation] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const textRef = useRef(null);
  const emojiRef = useRef(null);
  const gsapAnimationsRef = useRef(null);

  const loadingTexts = [
    "📄 Reading your resume...",
    "🔍 Analyzing job requirements...",
    "🧠 Comparing skills & experience...",
    "📊 Calculating match score...",
    "💡 Identifying skill gaps...",
    "🎯 Building personalized roadmap...",
    "✨ Finalizing AI insights...",
  ];

  // ---------------------------------------------------------------------------
  // CLEANUP ON UNMOUNT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    return () => {
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
  const typeWriter = async (key, text) => {
    let i = 0;
    let out = "";
    return new Promise((resolve) => {
      const int = setInterval(() => {
        out += text[i];
        setTypedOutput((p) => ({ ...p, [key]: out }));
        i++;
        if (i >= text.length) {
          clearInterval(int);
          resolve();
        }
      }, 10);
    });
  };

  // ---------------------------------------------------------------------------
  // GSAP LOADING ANIMATION
  // ---------------------------------------------------------------------------
  const startGSAPAnimation = () => {
    setShowAnimation(true);
    setCurrentTextIndex(0);

    setTimeout(() => {
      if (!textRef.current || !emojiRef.current) {
        console.error("Refs not available for GSAP animation");
        return;
      }

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
  // ANALYZE
  // ---------------------------------------------------------------------------
  const analyze = async () => {
    try {
      setLoading(true);
      setAiData(null);
      setTypedOutput({});

      // Start GSAP animation
      startGSAPAnimation();

      let response;

      // Upload mode
      if (mode === "upload") {
        if (!file) {
          toast.error("Please upload a resume.");
          setLoading(false);
          stopGSAPAnimation();
          return;
        }

        const form = new FormData();
        form.append("resume", file);
        form.append("jobDescription", jobDescription);
        form.append("isUrl", "false");

        response = await axios.post(`${AI_API_END_POINT}/analyze`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }

      // Profile mode
      if (mode === "profile") {
        response = await axios.post(
          `${AI_API_END_POINT}/analyze`,
          {
            resume: resumeUrl,
            jobDescription,
            isUrl: "true",
          },
          { withCredentials: true }
        );
      }

      // Stop animation
      stopGSAPAnimation();

      if (response.data.success) {
        const data = response.data.data;
        setAiData(data);

        await typeWriter("matchPercentage", data.matchPercentage);
        await typeWriter("missingSkills", data.missingSkills.join(", "));
        await typeWriter("strengths", data.strengths.join(", "));
        await typeWriter("roadmap", data.roadmap.join("\n"));
        await typeWriter("resumeRewrite", data.resumeRewrite);
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
      toast.error("Request failed.");
      stopGSAPAnimation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />

        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 w-[95%] max-w-3xl 
          max-h-[85vh] overflow-y-auto scrollbar-hide
          -translate-x-1/2 -translate-y-1/2 
          bg-white rounded-3xl p-7 shadow-2xl border border-gray-200"
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X size={26} />
          </button>

          <Dialog.Title className="text-3xl font-bold text-gray-900 mb-3">
            AI Job Match Analysis
          </Dialog.Title>

          {/* ------------------------------------------------------------------- */}
          {/* LOADING ANIMATION */}
          {/* ------------------------------------------------------------------- */}
          {showAnimation && (
            <div
              style={{
                height: "180px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <div
                ref={textRef}
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#1f2937",
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
          {/* MODE SELECTION & UPLOAD (HIDDEN WHEN LOADING) */}
          {/* ------------------------------------------------------------------- */}
          {!showAnimation && !aiData && (
            <>
              <div className="flex gap-3 mt-6">
                <button
                  className={`px-5 py-2.5 rounded-xl font-medium transition ${
                    mode === "profile"
                      ? "bg-[#6f3edb] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setMode("profile")}
                >
                  Use Profile Resume
                </button>

                <button
                  className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition ${
                    mode === "upload"
                      ? "bg-[#6f3edb] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setMode("upload")}
                >
                  <Upload size={18} /> Upload Resume
                </button>
              </div>

              {mode === "upload" && (
                <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="text-gray-900 font-semibold block mb-2">
                    Upload Resume (PDF)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border border-gray-300 p-2 rounded-lg w-full bg-white text-gray-800"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  className="w-full bg-[#6f3edb] hover:bg-[#5b2ec9] text-white 
                  font-semibold py-3 rounded-xl transition shadow-lg"
                  onClick={analyze}
                  disabled={loading}
                >
                  {loading ? "Analyzing..." : "Run AI Analysis"}
                </button>
              </div>
            </>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* RESULTS */}
          {/* ------------------------------------------------------------------- */}
          {aiData && !showAnimation && (
            <div className="mt-6 space-y-5 max-h-[450px] overflow-y-auto text-gray-900 pb-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 shadow-sm">
                <h2 className="font-semibold text-purple-900 mb-1">
                  Match Percentage
                </h2>
                <p className="text-4xl font-bold text-purple-600">
                  {typedOutput.matchPercentage}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-semibold text-[#6f3edb] mb-3">
                  Missing Skills
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {typedOutput.missingSkills &&
                    typedOutput.missingSkills.split(",").map((skill, idx) => (
                      <li key={idx} className="text-gray-700">
                        {skill.trim()}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-semibold text-[#6f3edb] mb-3">Strengths</h2>
                <p className="text-gray-700">{typedOutput.strengths}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-semibold text-[#6f3edb] mb-3">
                  Personalized Roadmap
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  {typedOutput.roadmap &&
                    typedOutput.roadmap
                      .split("\n")
                      .filter((step) => step.trim())
                      .map((step, idx) => (
                        <li key={idx} className="text-gray-700">
                          {step.trim()}
                        </li>
                      ))}
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-semibold text-[#6f3edb] mb-3">
                  AI Enhanced Resume
                </h2>
                <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                  {typedOutput.resumeRewrite}
                </pre>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AIModal;
