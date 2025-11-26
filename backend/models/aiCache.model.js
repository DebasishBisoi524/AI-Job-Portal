import mongoose from "mongoose";

const AICacheSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    hash: { type: String, required: true, unique: true },
    result: { type: Object, required: true },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60, // 1 hour TTL
    },
  },
  { timestamps: true }
);

export const AICache = mongoose.model("AICache", AICacheSchema);
