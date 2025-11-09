import mongoose from "mongoose";

const pyqSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: String, required: true },
    subject: { type: String, required: true },
    fileUrl: { type: String }, // PDF path
  },
  { timestamps: true }
);

const PYQ = mongoose.model("PYQ", pyqSchema);
export default PYQ;
