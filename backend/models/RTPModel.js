import mongoose from "mongoose";

const rtpSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

const RTP = mongoose.model("RTP", rtpSchema);
export default RTP;
