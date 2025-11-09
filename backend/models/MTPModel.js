import mongoose from "mongoose";

const mtpSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

const MTP = mongoose.model("MTP", mtpSchema);
export default MTP;
