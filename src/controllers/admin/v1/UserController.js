import createHttpError from "http-errors";
import User from "./../../../models/User.js";
import { isValidObjectId } from "./../../../utils/Helpers.js";
import bcrypt from "bcrypt";
export default {
  addUser: async (req, res, next) => {
    try {
      const { phone, password } = req.body;
      // const isUserExists = await User.findOne({ primary_phone });
      // if (isUserExists)
      //   throw createHttpError.Conflict(
      //     `${primary_phone} is already been registerd`
      //   );
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = await User.create({
        ...req.body,
        password: hashedPassword,
      }).catch((err) => {
        throw createHttpError.InternalServerError();
      });
      if (!data) throw createHttpError.InternalServerError();
      res.status(200).send({
        status: true,
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const user_id = req.params.id;
      if (!isValidObjectId(user_id)) throw createHttpError.BadRequest();
      const updated = await User.findByIdAndUpdate(user_id, req.body, {
        new: true,
      });
      if (!updated) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const booking_id = req.params.id;
      if (!isValidObjectId(booking_id)) throw createHttpError.BadRequest();
      const deleted = await User.findByIdAndRemove(booking_id).catch((err) => {
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
  getUsers: async (req, res) => {
    try {
      const data = await User.find({})
        .select("_id name primary_phone secondary_phone primary_email role")
        .lean();
      res.status(200).send({ status: true, data });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
};
