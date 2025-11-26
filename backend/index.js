import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import companyRoute from "./routes/company.routes.js";
import jobRoute from "./routes/job.routes.js";
import applicationRoute from "./routes/application.routes.js";
import aiRoute from "./routes/ai.route.js";
import atsRoute from "./routes/ats.route.js";
import path from "path";
dotenv.config({});

const app = express();

const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());
const corsOptions = {
  origin: "https://ai-job-portal-bfyb.onrender.com",
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/ai", aiRoute);
app.use("/api/v1", atsRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
