import mongoose from "mongoose";

const rtpSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: String, required: true },
    subject: { type: String, required: true },
    fileUrl: { type: String },   // PDF path
    fileName: { type: String },  // Original file name
  },
  { timestamps: true }
);

const RTP = mongoose.model("RTP", rtpSchema);
export default RTP;
