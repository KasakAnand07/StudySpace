const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  timeSpent: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  totalAnswers: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  streakCount: { type: Number, default: 0 },
  lastActiveDate: { type: String },
});

module.exports = mongoose.model("Progress", ProgressSchema);
