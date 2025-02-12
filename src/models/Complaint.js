import mongoose from "mongoose";
const ComplaintSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    image: {
      type: String,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    pincode: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    // coordinates: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     // required: true,
    //   },
    //   coordinates: {
    //     type: [Number],
    //     // required: true,
    //   },
    // },
  },
  { timestamps: true }
);
const ComplaintModel = mongoose.model("Complaint", ComplaintSchema);
export default ComplaintModel;
