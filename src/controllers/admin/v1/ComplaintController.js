import createHttpError from "http-errors";
import Complaint from "./../../../models/Complaint.js";
import { isValidObjectId } from "../../../utils/Helpers.js";
import bcrypt from "bcrypt";
import moment from "moment";
export default {
  addComplaint: async (req, res, next) => {
    try {
      const data = await Complaint.create({
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
      const complaints = await Complaint.find({})
        .select("_id image status latitude longitude area_id aqi createdAt")
        .populate({ path: "category_id", select: "name phone" })
        .populate({ path: "city_id", select: "name areas" })
        .sort({ _id: -1 })
        .lean();
      complaints?.map((complaint) => {
        complaint.category_name = complaint?.category_id?.name;
        complaint.city_name = complaint?.city_id?.name;
        complaint.area_name = complaint?.city_id?.areas?.find((area) =>
          area._id?.equals(complaint?.area_id)
        )?.name;
        complaint.client_name = complaint?.client_id?.name;
        complaint.client_phone = complaint?.client_id?.phone;
        complaint.created_at = moment(complaint?.createdAt).format(
          "DD/MM/YYYY hh:mm:ss"
        );
        delete complaint.category_id;
        delete complaint.city_id;
        delete complaint.client_id;
        delete complaint.area_id;
      });
      res.status(200).send({ status: true, data: complaints });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
};
