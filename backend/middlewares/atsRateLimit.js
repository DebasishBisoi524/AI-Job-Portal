import mongoose from "mongoose";

// Separate ATS rate-limit collection
const atsRateLimitSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ATSThrottle = mongoose.model("ATSThrottle", atsRateLimitSchema);

// Limit = 10 ATS requests per minute per user
const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 1000; // 60 seconds

export const atsRateLimit = async (req, res, next) => {
  try {
    // Identify user (or IP fallback)
    const userId = req.user?._id?.toString() || req.ip;

    const now = Date.now();
    const windowStart = new Date(now - WINDOW_MS);

    // Count ATS requests in last minute
    const requestCount = await ATSThrottle.countDocuments({
      userId,
      timestamp: { $gte: windowStart },
    });

    if (requestCount >= MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message:
          "ATS rate limit exceeded. Only 10 ATS scans per minute allowed.",
      });
    } 

    // Save this ATS request
    await ATSThrottle.create({
      userId,
      timestamp: new Date(),
    });

    next();
  } catch (error) {
    console.error("ATS Rate Limit Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal ATS rate-limit error",
    });
  }
};
