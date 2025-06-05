import createHttpError from "http-errors";
import Bulletin from "../../../models/master/Bulletin.js";

export default {
  getBulletins: async (req, res) => {
    try {
      const bulletins = await Bulletin.find().lean().sort({ createdAt: -1 });
      
      res.status(200).send({
        status: true,
        data: bulletins,
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  
  getBulletinById: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw createHttpError.BadRequest("Bulletin ID is required");
      }
      
      const bulletin = await Bulletin.findById(id).lean();
      
      if (!bulletin) {
        throw createHttpError.NotFound("Bulletin not found");
      }
      
      res.status(200).send({
        status: true,
        data: bulletin,
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  
  createBulletin: async (req, res) => {
    try {
      const { heading, content } = req.body;
      
      if (!heading || !content) {
        throw createHttpError.BadRequest("Heading and content are required");
      }
      
      const bulletin = new Bulletin({
        heading,
        content,
      });
      
      await bulletin.save();
      
      res.status(201).send({
        status: true,
        message: "Bulletin created successfully",
        data: bulletin,
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  
  updateBulletin: async (req, res) => {
    try {
      const { id } = req.params;
      const { heading, content } = req.body;
      
      if (!id) {
        throw createHttpError.BadRequest("Bulletin ID is required");
      }
      
      if (!heading && !content) {
        throw createHttpError.BadRequest("At least one field (heading or content) is required for update");
      }
      
      const updateData = {};
      if (heading) updateData.heading = heading;
      if (content) updateData.content = content;
      
      const bulletin = await Bulletin.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      
      if (!bulletin) {
        throw createHttpError.NotFound("Bulletin not found");
      }
      
      res.status(200).send({
        status: true,
        message: "Bulletin updated successfully",
        data: bulletin,
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  
  deleteBulletin: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw createHttpError.BadRequest("Bulletin ID is required");
      }
      
      const bulletin = await Bulletin.findByIdAndDelete(id);
      
      if (!bulletin) {
        throw createHttpError.NotFound("Bulletin not found");
      }
      
      res.status(200).send({
        status: true,
        message: "Bulletin deleted successfully",
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
};