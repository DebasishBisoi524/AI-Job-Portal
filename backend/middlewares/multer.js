import multer from "multer";

const storage = multer.memoryStorage();

export const uploadFields = multer({ storage }).fields([
  { name: "file", maxCount: 1 }, // profile picture
  { name: "resume", maxCount: 1 }, // resume
]);
