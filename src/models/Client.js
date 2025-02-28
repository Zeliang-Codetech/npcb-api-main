import mongoose from "mongoose";
const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    phone: {
      type: Number,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
    fcm_token: {
      type: String,
    },
    role: {
      type: Number,
    },
    status: {
      type: Number,
      default: 1,
    },
    last_login_at: {
      type: Date,
    },
  },
  { timestamps: true }
);
const ClientModel = mongoose.model("Client", ClientSchema);
export default ClientModel;
