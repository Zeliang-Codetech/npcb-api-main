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
};