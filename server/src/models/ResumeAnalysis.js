// import mongoose from "mongoose";

// const ResumeAnalysisSchema = new mongoose.Schema(
//   {
//     candidateName: { type: String, default: "Unknown Candidate" },
//     fileName: { type: String, required: true },
//     resumeText: { type: String, default: "" },
//     extractedSkills: [{ type: String }],
//     jobDescription: { type: String, required: true },
//     matchedSkills: [{ type: String }],
//     missingSkills: [{ type: String }],
//     score: { type: Number, default: 0 },
//     suggestions: [{ type: String }],
//     analytics: {
//       skillMatchPercent: { type: Number, default: 0 },
//       resumeWordCount: { type: Number, default: 0 },
//       jdWordCount: { type: Number, default: 0 },
//       matchedSkillsCount: { type: Number, default: 0 },
//       missingSkillsCount: { type: Number, default: 0 }
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);

import mongoose from "mongoose";

const ResumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    candidateName: { type: String, default: "Unknown Candidate" },
    fileName: { type: String, required: true },
    resumeText: { type: String, default: "" },
    extractedSkills: [{ type: String }],
    jobDescription: { type: String, required: true },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    score: { type: Number, default: 0 },
    suggestions: [{ type: String }],
    analytics: {
      skillMatchPercent: { type: Number, default: 0 },
      resumeWordCount: { type: Number, default: 0 },
      jdWordCount: { type: Number, default: 0 },
      matchedSkillsCount: { type: Number, default: 0 },
      missingSkillsCount: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);