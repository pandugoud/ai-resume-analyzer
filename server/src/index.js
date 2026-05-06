// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import morgan from "morgan";
// import connectDB from "./config/db.js";
// import resumeRoutes from "./routes/resumeRoutes.js";

// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json({ limit: "10mb" }));
// app.use(morgan("dev"));

// app.get("/", (req, res) => {
//   res.json({ message: "Resume Analyzer API running" });
// });

// app.use("/api/resume", resumeRoutes);

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Resume Analyzer API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));