import express from "express";
import { analyzeResume } from "../controllers/ai.controller.js";
import { uploadFields } from "../middlewares/multer.js";
import { aiRateLimit } from "../middlewares/aiRateLimit.js";

const router = express.Router();

router.post("/analyze", aiRateLimit, uploadFields, analyzeResume);

export default router;
