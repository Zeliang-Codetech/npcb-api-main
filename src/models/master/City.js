import mongoose from "mongoose";
const areaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  aqi: {
    type: Number,
    default: 0,
  },
});
const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    areas: [areaSchema],
  },
  { timestamps: true }
);

const CityModel = mongoose.model("City", CitySchema);
export default CityModel;
