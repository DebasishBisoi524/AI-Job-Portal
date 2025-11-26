import crypto from "crypto";

export const createCacheHash = (resumeText, jobDescription, userId) => {
  return crypto
    .createHash("sha256")
    .update(resumeText + "|" + jobDescription + "|" + userId)
    .digest("hex");
};
