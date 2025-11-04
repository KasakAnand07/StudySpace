import express from "express";
import Flashcard from "../models/Flashcard.js";

const router = express.Router();

// Get all flashcards
router.get("/", async (req, res) => {
  const flashcards = await Flashcard.find();
  res.json(flashcards);
});

// Add new flashcard
router.post("/", async (req, res) => {
  const { question, answer, subject } = req.body;
  const newCard = new Flashcard({ question, answer, subject });
  await newCard.save();
  res.status(201).json(newCard);
});

// Update flashcard
router.put("/:id", async (req, res) => {
  const updatedCard = await Flashcard.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedCard);
});

// Delete flashcard
router.delete("/:id", async (req, res) => {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.json({ message: "Flashcard deleted" });
});

export default router;
