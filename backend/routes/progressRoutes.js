const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

// ✅ Get all progress for logged-in user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const progressData = await Progress.find({ userId }).populate("subjectId", "name");
    res.json(progressData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update time spent + streak logic
router.put("/:subjectId/update-time", async (req, res) => {
  const { subjectId } = req.params;
  const { duration } = req.body;

  try {
    const progress = await Progress.findOne({ subjectId });
    if (!progress) return res.status(404).json({ message: "Progress not found" });

    // add duration
    progress.timeSpent += duration;

    // streak logic
    const today = new Date().toLocaleDateString("en-CA");
    const last = progress.lastActiveDate;
    if (last !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toLocaleDateString("en-CA");
      progress.streakCount = last === yStr ? progress.streakCount + 1 : 1;
      progress.lastActiveDate = today;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update accuracy when questions answered
router.put("/:subjectId/update-accuracy", async (req, res) => {
  const { subjectId } = req.params;
  const { correct, total } = req.body;

  try {
    const progress = await Progress.findOne({ subjectId });
    if (!progress) return res.status(404).json({ message: "Progress not found" });

    progress.correctAnswers += correct;
    progress.totalAnswers += total;

    progress.accuracy =
      progress.totalAnswers > 0
        ? ((progress.correctAnswers / progress.totalAnswers) * 100).toFixed(1)
        : 0;

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
