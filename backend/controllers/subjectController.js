import Subject from "../models/subjectModel.js";

// @desc    Add a new subject
// @route   POST /api/subjects
export const addSubject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    const subject = await Subject.create({
      name,
      description,
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Server error while adding subject" });
  }
};

// @desc    Get all subjects
// @route   GET /api/subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Server error while fetching subjects" });
  }
};

// @desc    Get a single subject by ID
// @route   GET /api/subjects/:id
export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ message: "Server error while fetching subject" });
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Subject.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ message: "Server error while updating subject" });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Server error while deleting subject" });
  }
};
