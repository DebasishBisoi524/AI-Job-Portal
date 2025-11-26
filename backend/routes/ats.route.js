import express from "express";
import { getATSScore } from "../controllers/ats.controller.js";
import { uploadFields } from "../middlewares/multer.js";
import { atsRateLimit } from "../middlewares/atsRateLimit.js";

const router = express.Router();

router.post("/ai/check-ats-score", atsRateLimit, uploadFields, getATSScore);

export default router;
