import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const RateLimit = mongoose.model("RateLimit", rateLimitSchema);

// Limit = 10 requests per minute per user
const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 1000; // 60 seconds

export const aiRateLimit = async (req, res, next) => {
  try { 
    // Identify user or fallback to IP address
    const userId = req.user?._id?.toString() || req.ip;

    const now = Date.now();
    const windowStart = new Date(now - WINDOW_MS);

    // Count requests in the last 60 seconds
    const requestCount = await RateLimit.countDocuments({
      userId,
      timestamp: { $gte: windowStart },
    });

    if (requestCount >= MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message:
          "Rate limit exceeded. Try again in a few seconds (10 requests per minute allowed).",
      });
    }

    // Store this request
    await RateLimit.create({
      userId,
      timestamp: new Date(),
    });

    next();
  } catch (error) {
    console.error("Rate Limit Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal rate-limit error",
    });
  }
};
