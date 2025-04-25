import createHttpError from "http-errors";
import Complaint from "./../../../models/Complaint.js";
import { isValidObjectId } from "../../../utils/Helpers.js";
import bcrypt from "bcrypt";
import Client from "./../../../models/Client.js";
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
      complaints?.map((complaint) => { });
      res.status(200).send({ status: true, data: complaints });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
  getMyComplaints: async (req, res) => {
    try {
      const client_id = req.payload._id;
      
      const client = await Client.findById(client_id).lean();
      if (!client) {
        throw createHttpError.NotFound('Client not found');
      }

      
      const complaints = await Complaint.find({ 
        client_id: client_id  
      })
        .select("_id image status latitude longitude aqi createdAt")  // Added createdAt
        .populate({ path: "category_id", select: "name" })
        .populate({ path: "city_id", select: "name" })
        .sort({ createdAt: -1 })
        .lean();

      // Transform the response
      const transformedComplaints = complaints.map(complaint => ({
        _id: complaint._id,
        image: complaint.image,
        status: complaint.status,
        latitude: complaint.latitude,
        longitude: complaint.longitude,
        aqi: complaint.aqi,
        created_at: complaint.createdAt,
        category_name: complaint?.category_id?.name || null,
        city_name: complaint?.city_id?.name || null
      }));

      // Return user data based on login type
      const userData = {
        _id: client._id,
        name: client.name,
        login_type: client.login_type
      };

      if (client.login_type === 'email') {
        userData.email = client.email;
      } else {
        userData.phone = client.phone;
      }

      res.status(200).send({ 
        status: true, 
        data: transformedComplaints,
        user: userData
      });
    } catch (err) {
      res.status(err.status || 500).send({ 
        status: false, 
        message: err.message 
      });
    }
  },
  getComplaintById: async (req, res, next) => {
      try {
        const complaint_id = req.params.id;
        if (!isValidObjectId(complaint_id)) throw createHttpError.BadRequest();
        const complaint = await Complaint.findById(complaint_id)
          .populate({ path: "category_id", select: "name" })
          .populate({ path: "city_id", select: "name" })
          .lean();
        if (!complaint) throw createHttpError.NotFound();
        complaint.category_name = complaint?.category_id?.name;
        complaint.city_name = complaint?.city_id?.name;
        delete complaint.category_id;
        delete complaint.city_id;
        res.status(200).send({ status: true, data: complaint });
      } catch (err) {
        res.status(err.status || 500).send({ status: false, message: err.message });
      }
    },
};