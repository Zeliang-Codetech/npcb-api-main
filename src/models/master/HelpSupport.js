import mongoose from "mongoose";

const HelpSupportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: [String],
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const HelpSupportModel = mongoose.model("HelpSupport", HelpSupportSchema);
export default HelpSupportModel;