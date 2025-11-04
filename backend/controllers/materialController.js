import Material from "../models/studyMaterialModel.js";
import fs from "fs";
import path from "path";

export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    // Delete file from uploads folder
    const filePath = path.resolve("uploads", path.basename(material.fileUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Material.deleteOne({ _id: req.params.id });
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error("Error deleting material:", error);
    res.status(500).json({ message: "Server error deleting material" });
  }
};

// ✅ Fetch materials by subject ID
export const getMaterialsBySubject = async (req, res) => {
  try {
    const { id } = req.params;
    const materials = await Material.find({ subjectId: id }).sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    console.error("Error fetching materials by subject:", error);
    res.status(500).json({ message: "Server error fetching materials" });
  }
};