import mongoose from "mongoose";

const BulletinSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BulletinModel = mongoose.model("Bulletin", BulletinSchema);
export default BulletinModel;