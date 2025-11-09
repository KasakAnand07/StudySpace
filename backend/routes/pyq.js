import express from "express";
import PYQ from "../models/PYQModel.js";

const router = express.Router();

// Get all PYQs
router.get("/", async (req, res) => {
  try {
    const data = await PYQ.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new PYQ
router.post("/", async (req, res) => {
  try {
    const newItem = new PYQ(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
