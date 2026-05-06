// import fs from "fs";
// import ResumeAnalysis from "../models/ResumeAnalysis.js";
// import { analyzeResumeWithAI } from "../services/aiService.js";

// export const analyzeResume = async (req, res) => {
//   try {
//     const { jobDescription } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: "Resume PDF is required" });
//     }

//     if (!jobDescription) {
//       return res.status(400).json({ message: "Job description is required" });
//     }

//     const payload = {
//       filePath: req.file.path,
//       fileName: req.file.filename,
//       jobDescription
//     };

//     const aiResult = await analyzeResumeWithAI(payload);

//     const saved = await ResumeAnalysis.create({
//       candidateName: aiResult.candidateName || "Unknown Candidate",
//       fileName: req.file.filename,
//       resumeText: aiResult.resumeText || "",
//       extractedSkills: aiResult.extractedSkills || [],
//       jobDescription,
//       matchedSkills: aiResult.matchedSkills || [],
//       missingSkills: aiResult.missingSkills || [],
//       score: aiResult.score || 0,
//       suggestions: aiResult.suggestions || [],
//       analytics: aiResult.analytics || {}
//     });

//     res.status(201).json(saved);
//   } catch (error) {
//     console.error("Analyze error:", error.message);
//     res.status(500).json({ message: "Failed to analyze resume", error: error.message });
//   }
// };

// export const getAllAnalyses = async (req, res) => {
//   try {
//     const data = await ResumeAnalysis.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch analyses" });
//   }
// };

// export const getDashboardStats = async (req, res) => {
//   try {
//     const analyses = await ResumeAnalysis.find();

//     const totalAnalyses = analyses.length;
//     const averageScore = totalAnalyses
//       ? Math.round(analyses.reduce((sum, item) => sum + item.score, 0) / totalAnalyses)
//       : 0;

//     const highMatches = analyses.filter((item) => item.score >= 70).length;
//     const lowMatches = analyses.filter((item) => item.score < 70).length;

//     const skillMap = {};
//     analyses.forEach((item) => {
//       item.extractedSkills.forEach((skill) => {
//         skillMap[skill] = (skillMap[skill] || 0) + 1;
//       });
//     });

//     const topSkills = Object.entries(skillMap)
//       .map(([skill, count]) => ({ skill, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 8);

//     res.json({
//       totalAnalyses,
//       averageScore,
//       highMatches,
//       lowMatches,
//       topSkills
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch dashboard stats" });
//   }
// };

import ResumeAnalysis from "../models/ResumeAnalysis.js";
import { analyzeResumeWithAI } from "../services/aiService.js";

export const analyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }

    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required" });
    }

    const payload = {
      filePath: req.file.path,
      fileName: req.file.filename,
      jobDescription
    };

    const aiResult = await analyzeResumeWithAI(payload);

    const saved = await ResumeAnalysis.create({
      user: req.user.id,
      candidateName: aiResult.candidateName || "Unknown Candidate",
      fileName: req.file.filename,
      resumeText: aiResult.resumeText || "",
      extractedSkills: aiResult.extractedSkills || [],
      jobDescription,
      matchedSkills: aiResult.matchedSkills || [],
      missingSkills: aiResult.missingSkills || [],
      score: aiResult.score || 0,
      suggestions: aiResult.suggestions || [],
      analytics: aiResult.analytics || {}
    });

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to analyze resume", error: error.message });
  }
};

export const getAllAnalyses = async (req, res) => {
  try {
    const data = await ResumeAnalysis.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analyses" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ user: req.user.id });

    const totalAnalyses = analyses.length;
    const averageScore = totalAnalyses
      ? Math.round(analyses.reduce((sum, item) => sum + item.score, 0) / totalAnalyses)
      : 0;

    const highMatches = analyses.filter((item) => item.score >= 70).length;
    const lowMatches = analyses.filter((item) => item.score < 70).length;

    const skillMap = {};
    analyses.forEach((item) => {
      item.extractedSkills.forEach((skill) => {
        skillMap[skill] = (skillMap[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    res.json({ totalAnalyses, averageScore, highMatches, lowMatches, topSkills });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};