import express from "express";

const router = express.Router();

// temporary in-memory storage
let subjects = [];

// GET all subjects
router.get("/", (req, res) => {
  res.json(subjects);
});

// POST a new subject
router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Subject name is required" });

  const newSubject = { id: Date.now(), name };
  subjects.push(newSubject);
  res.json(newSubject);
});

export default router;
