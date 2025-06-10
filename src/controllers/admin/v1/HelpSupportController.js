import createHttpError from "http-errors";
import HelpSupport from "../../../models/master/HelpSupport.js";

export default {
  getHelpSupport: async (req, res) => {
    try {
      // Find the first document or return empty object if none exists
      const helpSupport = await HelpSupport.findOne().lean() || {
        name: "",
        phone: [],
        designation: "",
        email: "",
        address: "",
      };
      
      res.status(200).send({
        status: true,
        data: helpSupport,
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  
  updateHelpSupport: async (req, res) => {
    try {
      const { name, phone, designation, email, address } = req.body;
      
      // Validate required fields
      if (!name || !phone || !designation || !email || !address) {
        throw createHttpError.BadRequest("All fields are required");
      }
      
      // Find and update the first document, or create if none exists (upsert)
      const helpSupport = await HelpSupport.findOneAndUpdate(
        {}, // empty filter to match first document
        { name, phone, designation, email, address },
        { new: true, upsert: true }
      );
      
      res.status(200).send({
        status: true,
        message: "Contact information updated successfully",
        data: helpSupport,
      });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
};