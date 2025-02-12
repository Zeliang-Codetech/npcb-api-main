import createHttpError from "http-errors";
import City from "../../../../models/master/City.js";
import { isValidObjectId } from "../../../../utils/Helpers.js";
export default {
  addCity: async (req, res, next) => {
    try {
      const data = await City.create({ ...req.body }).catch((err) => {
        throw createHttpError.InternalServerError();
      });
      if (!data) throw createHttpError.InternalServerError();
      res.status(200).send({
        status: true,
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: err.message,
      });
    }
  },
  updateCity: async (req, res, next) => {
    try {
      const city_id = req.params.id;
      if (!isValidObjectId(city_id)) throw createHttpError.BadRequest();
      const city = await City.findByIdAndUpdate(city_id, req.body, {
        new: true,
      });
      if (!city) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  deleteCity: async (req, res, next) => {
    try {
      const city_id = req.params.id;
      if (!isValidObjectId(city_id)) throw createHttpError.BadRequest();
      const deleted = await City.findByIdAndRemove(city_id).catch((err) => {
        throw createHttpError.InternalServerError();
      });
      if (!deleted) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: err.message,
      });
    }
  },
  getCities: async (req, res) => {
    try {
      const data = await City.find({}).select("_id name areas").lean();
      res.status(200).send({ status: true, data });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
};
