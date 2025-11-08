import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import studyMaterialRoutes from "./routes/studyMaterialRoutes.js";
import path from "path";
import uploadRoutes from "./routes/uploadRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import studySessionRoutes from "./routes/studySessionRoutes.js";

dotenv.config();

// Connect Database (centralized function)
connectDB();

const app = express();

const allowedOrigins = [
  "https://studyace.netlify.app"
  // "http://localhost:5173", // for local testing
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/subjects", subjectRoutes);
app.use("/api/materials", studyMaterialRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/study-sessions", studySessionRoutes);

// File upload static path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/api/upload", uploadRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("📚 StudySpace API is running successfully...");
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

