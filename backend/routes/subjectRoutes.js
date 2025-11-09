import express from "express";
import Subject from "../models/subjectModel.js";

const router = express.Router();

// GET all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
});

// POST a new subject
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    const newSubject = new Subject({ name, description });
    const savedSubject = await newSubject.save();

    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(500).json({ message: "Failed to add subject" });
  }
});

// DELETE a subject
router.delete("/:id", async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subject" });
  }
});

// UPDATE a subject
router.put("/:id", async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Subject not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update subject" });
  }
});

export default router;
