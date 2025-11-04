import express from "express";
import StudySession from "../models/StudySession.js";
const router = express.Router();

// --- Start a study session ---
router.post("/start", async (req, res) => {
  try {
    const { subject } = req.body;
    const session = new StudySession({
      subject,
      startTime: new Date(),
      isActive: true,
    });
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Error starting session" });
  }
});

// --- Stop a study session ---
router.post("/stop/:id", async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.endTime = new Date();
    session.isActive = false;
    session.duration =
      (new Date(session.endTime) - new Date(session.startTime)) / 1000 / 60; // in minutes
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Error stopping session" });
  }
});

// --- Get user progress summary ---
router.get("/summary", async (req, res) => {
  try {
    const sessions = await StudySession.find({ isActive: false });

    // Group by subject
    const summary = {};
    sessions.forEach((s) => {
      if (!summary[s.subject]) summary[s.subject] = 0;
      summary[s.subject] += s.duration;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Error getting summary" });
  }
});

export default router;
