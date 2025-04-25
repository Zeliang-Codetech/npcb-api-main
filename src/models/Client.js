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
      sparse: true,
    },
    login_type: {
      type: String,
      enum: ['email', 'phone'],
      required: true
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
    otp: {
      type: String,
    },
    otp_expires_at: {
      type: Date,
    },
    last_login_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Improved indexes for email and phone
ClientSchema.index(
  { email: 1 }, 
  { 
    unique: true,
    sparse: true,
    partialFilterExpression: { email: { $exists: true, $ne: null } }
  }
);

ClientSchema.index(
  { phone: 1 }, 
  { 
    unique: true,
    sparse: true,
    partialFilterExpression: { phone: { $exists: true, $ne: null } }
  }
);

const ClientModel = mongoose.model("Client", ClientSchema);
export default ClientModel;
