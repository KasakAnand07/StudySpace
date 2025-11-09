import express from "express";
import PYQ from "../models/PYQModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const UPLOADS_FOLDER = "uploads";
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER);

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// GET all PYQs
router.get("/", async (req, res) => {
  try {
    const data = await PYQ.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new PYQ
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { year, subject, attempt } = req.body;

    if (!subject || !year || !attempt || !req.file) {
      return res.status(400).json({ message: "All fields including PDF are required" });
    }

    const newItem = new PYQ({
      title: `${subject} ${year} ${attempt}`,
      year,
      subject,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE PYQ (fields + optional PDF)
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const pyq = await PYQ.findById(id);
    if (!pyq) return res.status(404).json({ message: "PYQ not found" });

    const { year, subject, attempt } = req.body;

    // Update fields
    if (year) pyq.year = year;
    if (subject) pyq.subject = subject;
    if (attempt) pyq.title = `${subject || pyq.subject} ${year || pyq.year} ${attempt}`;

    // If new PDF uploaded, delete old file and save new path
    if (req.file) {
      if (pyq.fileUrl) {
        const oldFilePath = path.join(process.cwd(), pyq.fileUrl);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      pyq.fileUrl = `/uploads/${req.file.filename}`;
    }

    await pyq.save();
    res.json(pyq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE PYQ (also delete PDF)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pyq = await PYQ.findById(id);
    if (!pyq) return res.status(404).json({ message: "PYQ not found" });

    // Delete PDF file
    if (pyq.fileUrl) {
      const filePath = path.join(process.cwd(), pyq.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pyq.deleteOne();
    res.json({ message: "PYQ deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
