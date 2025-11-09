import mongoose from "mongoose";

const pyqSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: String },
    subject: { type: String },
    fileUrl: { type: String }, // Optional: for link or file upload
  },
  { timestamps: true }
);

const PYQ = mongoose.model("PYQ", pyqSchema);
export default PYQ;
