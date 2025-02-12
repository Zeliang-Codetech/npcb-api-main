import createHttpError from "http-errors";
import Complaint from "./../../../models/Complaint.js";
import { isValidObjectId } from "../../../utils/Helpers.js";
import bcrypt from "bcrypt";
export default {
  addComplaint: async (req, res, next) => {
    try {
      const client_id = req.payload._id;
      if (req.file) {
        req.body.image = req.file.key;
      }
      // req.body.coordinates = {
      //   type: "Point",
      //   coordinates: [latitude, longitude],
      // };
      const complaint = await Complaint.create({
        ...req.body,
        client_id,
      }).catch((err) => {
        throw createHttpError.InternalServerError();
      });
      if (!complaint) throw createHttpError.InternalServerError();
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
  updateComplaint: async (req, res, next) => {
    try {
      const complaint_id = req.params.id;
      if (!isValidObjectId(complaint_id)) throw createHttpError.BadRequest();
      const complaint = await Complaint.findByIdAndUpdate(
        complaint_id,
        req.body,
        {
          new: true,
        }
      );
      if (!complaint) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },

  deleteComplaint: async (req, res, next) => {
    try {
      const complaint_id = req.params.id;
      if (!isValidObjectId(complaint_id)) throw createHttpError.BadRequest();
      const complaint = await Complaint.findByIdAndRemove(complaint_id).catch(
        (err) => {
          throw createHttpError.InternalServerError();
        }
      );
      if (!complaint) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: err.message,
      });
    }
  },
  getComplaints: async (req, res) => {
    try {
      const client_id = req.params._id;
      const complaints = await Complaint.find({})
        .select("_id status latitude longitude")
        .sort({ _id: -1 })
        .lean();
      complaints?.map((complaint) => {});
      res.status(200).send({ status: true, data: complaints });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
  getMyComplaints: async (req, res) => {
    try {
      const client_id = req.params._id;
      const complaints = await Complaint.find({})
        .select("_id image status latitude longitude aqi")
        .populate({ path: "category_id", select: "name" })
        .populate({ path: "city_id", select: "name" })
        .sort({ _id: -1 })
        .lean();
      complaints?.map((complaint) => {
        complaint.category_name = complaint?.category_id?.name;
        complaint.city_name = complaint?.city_id?.name;
        delete complaint.category_id;
        delete complaint.city_id;
      });
      res.status(200).send({ status: true, data: complaints });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
};
