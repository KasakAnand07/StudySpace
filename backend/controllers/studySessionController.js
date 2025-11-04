import StudySession from "../models/StudySession.js";

// Utility: check if two dates are consecutive
const isConsecutive = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = (d1 - d2) / (1000 * 60 * 60 * 24);
  return diff <= 1 && diff >= 0;
};

// ✅ Start a new session
export const startSession = async (req, res) => {
  try {
    const { subject } = req.body;
    const session = await StudySession.create({ subject });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Failed to start session" });
  }
};

// ✅ Stop a session
export const stopSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await StudySession.findById(id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    session.endTime = new Date();
    session.duration = Math.round(
      (session.endTime - session.startTime) / (1000 * 60)
    );
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Failed to stop session" });
  }
};

// ✅ Get study summary (for charts + streak)
export const getSummary = async (req, res) => {
  try {
    const sessions = await StudySession.find({});

    // --- Time per subject ---
    const timePerSubject = {};
    sessions.forEach((s) => {
      if (s.duration > 0) {
        if (!timePerSubject[s.subject]) timePerSubject[s.subject] = 0;
        timePerSubject[s.subject] += s.duration;
      }
    });

    // --- Streak calculation ---
    const sortedSessions = sessions
      .filter((s) => s.endTime)
      .sort((a, b) => new Date(b.endTime) - new Date(a.endTime));

    let currentStreak = 0;
    let lastDate = null;

    for (let session of sortedSessions) {
      const sessionDate = new Date(session.endTime);
      sessionDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        lastDate = sessionDate;
        currentStreak = 1;
      } else {
        const diff =
          (lastDate.getTime() - sessionDate.getTime()) /
          (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
          lastDate = sessionDate;
        } else if (diff === 0) {
          continue; // same day session
        } else {
          break;
        }
      }
    }

    // Check if last session was today — maintain streak
    const today = new Date();
    const lastStudyDate = lastDate ? new Date(lastDate) : null;
    const sameDay =
      lastStudyDate &&
      today.toDateString() === lastStudyDate.toDateString();

    const consecutive =
      lastStudyDate &&
      isConsecutive(today, lastStudyDate) &&
      !sameDay;

    res.json({
      timePerSubject,
      currentStreak: consecutive ? currentStreak : 0,
      lastStudyDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};
