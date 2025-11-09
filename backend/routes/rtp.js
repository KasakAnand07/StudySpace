import express from "express";
import RTP from "../models/RTPModel.js";
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

// GET all RTPs
router.get("/", async (req, res) => {
  try {
    const data = await RTP.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new RTP
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { year, subject, attempt } = req.body;

    if (!subject || !year || !attempt || !req.file) {
      return res.status(400).json({ message: "All fields including PDF are required" });
    }

    const newItem = new RTP({
      title: `${subject} ${year} ${attempt}`,
      year,
      subject,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname, // <-- store original file name
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE RTP
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const rtp = await RTP.findById(id);
    if (!rtp) return res.status(404).json({ message: "RTP not found" });

    const { year, subject, attempt } = req.body;

    if (year) rtp.year = year;
    if (subject) rtp.subject = subject;
    if (attempt) rtp.title = `${subject || rtp.subject} ${year || rtp.year} ${attempt}`;

    if (req.file) {
      // Delete old file
      if (rtp.fileUrl) {
        const oldFilePath = path.join(process.cwd(), rtp.fileUrl);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      rtp.fileUrl = `/uploads/${req.file.filename}`;
      rtp.fileName = req.file.originalname; // <-- store new original name
    }

    await rtp.save();
    res.json(rtp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE RTP (also delete PDF)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rtp = await RTP.findById(id);
    if (!rtp) return res.status(404).json({ message: "RTP not found" });

    // Delete PDF file
    if (rtp.fileUrl) {
      const filePath = path.join(process.cwd(), rtp.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await rtp.deleteOne();
    res.json({ message: "RTP deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
