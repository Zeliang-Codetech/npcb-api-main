import createHttpError from "http-errors";
import Client from "./../../../models/Client.js";
import { isValidObjectId } from "../../../utils/Helpers.js";
import bcrypt from "bcrypt";
export default {
  addClient: async (req, res, next) => {
    try {
      const data = await Client.create({
        ...req.body,
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
  updateClient: async (req, res, next) => {
    try {
      const client_id = req.params.id;
      if (!isValidObjectId(client_id)) throw createHttpError.BadRequest();
      const client = await Client.findByIdAndUpdate(client_id, req.body, {
        new: true,
      });
      if (!client) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  deleteClient: async (req, res, next) => {
    try {
      const client_id = req.params.id;
      if (!isValidObjectId(client_id)) throw createHttpError.BadRequest();
      const deleted = await Client.findByIdAndRemove(client_id).catch((err) => {
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
  getClients: async (req, res) => {
    try {
      const data = await Client.find({})
        .select("_id name phone email")

        .lean();
      res.status(200).send({ status: true, data });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
};
