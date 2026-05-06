// import express from "express";
// import upload from "../middleware/upload.js";
// import {
//   analyzeResume,
//   getAllAnalyses,
//   getDashboardStats
// } from "../controllers/resumeController.js";

// const router = express.Router();

// router.post("/analyze", upload.single("resume"), analyzeResume);
// router.get("/all", getAllAnalyses);
// router.get("/stats", getDashboardStats);

// export default router;

import express from "express";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  analyzeResume,
  getAllAnalyses,
  getDashboardStats
} from "../controllers/resumeController.js";

const router = express.Router();

router.post("/analyze", authMiddleware, upload.single("resume"), analyzeResume);
router.get("/all", authMiddleware, getAllAnalyses);
router.get("/stats", authMiddleware, getDashboardStats);

export default router;