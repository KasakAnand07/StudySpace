import express from "express";
// import { addMaterial, getMaterials, deleteMaterial } from "../controllers/studyMaterialController.js";
import Material from "../models/studyMaterialModel.js";

const router = express.Router();

// 📦 GET all materials
router.get("/", async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📘 GET materials by subjectId
router.get("/subject/:id", async (req, res) => {
  try {
    const materials = await Material.find({ subjectId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➕ ADD new material
router.post("/", async (req, res) => {
  try {
    const { title, description, subject, subjectId, fileUrl } = req.body;

    const material = new Material({
      title,
      description,
      subject,
      subjectId,
      fileUrl,
    });

    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🗑️ DELETE material
router.delete("/:id", async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material)
      return res.status(404).json({ message: "Material not found" });
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;