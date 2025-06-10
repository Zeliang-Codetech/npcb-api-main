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
};