import StudyMaterial from "../models/studyMaterialModel.js";

// Upload a new study material
export const addMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.create(req.body);
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all materials (or by subject)
export const getMaterials = async (req, res) => {
  try {
    const { subject } = req.query;
    const materials = subject
      ? await StudyMaterial.find({ subject })
      : await StudyMaterial.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a material
export const deleteMaterial = async (req, res) => {
  try {
    await StudyMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
