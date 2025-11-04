import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  startTime: Date,
  endTime: Date,
  duration: Number, // in minutes
  isActive: { type: Boolean, default: false },
});

export default mongoose.model("StudySession", studySessionSchema);
