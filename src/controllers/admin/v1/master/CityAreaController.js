import createHttpError from "http-errors";
import City from "./../../../../models/master/City.js";

export default {
  addArea: async (req, res, next) => {
    try {
      const { city_id, name, aqi } = req.body;
      const updatedCity = await City.findOneAndUpdate(
        { _id: city_id },
        { $push: { areas: { name, aqi } } },
        { new: true }
      ).catch((err) => {
        throw createHttpError.InternalServerError();
      });
      res.status(201).send({
        status: true,
        updatedCity,
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: err.message,
      });
    }
  },
  updateArea: async (req, res, next) => {
    try {
      const { name, aqi, city_id } = req.body;
      const area_id = req.params.id;
      const updatedArea = await City.findOneAndUpdate(
        { _id: city_id, "areas._id": area_id },
        { $set: { "areas.$": req.body } },
        { new: true }
      );
      if (!updatedArea) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true, updatedArea });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: err.message,
      });
    }
  },
  deleteArea: async (req, res, next) => {
    try {
      const { city_id } = req.body;
      const area_id = req.params.id;
      const updatedCity = await City.findOneAndUpdate(
        { _id: city_id },
        { $pull: { areas: { _id: area_id } } },
        { new: true }
      );
      res.status(200).send({ status: true });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: err.message,
      });
    }
  },
};
