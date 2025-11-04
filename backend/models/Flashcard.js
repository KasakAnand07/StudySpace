import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  subject: { type: String },
});

export default mongoose.model("Flashcard", flashcardSchema);
