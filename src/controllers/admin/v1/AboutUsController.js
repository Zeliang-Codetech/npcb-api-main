import createHttpError from "http-errors";
import AboutUs from "../../../models/master/AboutUs.js";

export default {
  getAboutUs: async (req, res) => {
    try {
      // Find the first document or return empty content if none exists
      const aboutUs = await AboutUs.findOne().lean() || { content: "" };
      
      res.status(200).send({
        status: true,
        data: aboutUs,
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  
  updateAboutUs: async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        throw createHttpError.BadRequest("Content is required");
      }
      
      // Find and update the first document, or create if none exists (upsert)
      const aboutUs = await AboutUs.findOneAndUpdate(
        {}, // empty filter to match first document
        { content },
        { new: true, upsert: true }
      );
      
      res.status(200).send({
        status: true,
        data: aboutUs,
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
};