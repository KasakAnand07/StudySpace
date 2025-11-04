import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject", // references your Subject collection
      required: false, // optional for now (since some uploads may be global)
    },
    subject: { type: String }, // for general uploads (sidebar)
    fileUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("StudyMaterial", studyMaterialSchema);
