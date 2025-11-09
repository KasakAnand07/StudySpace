import express from "express";
import MTP from "../models/MTPModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await MTP.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newItem = new MTP(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
