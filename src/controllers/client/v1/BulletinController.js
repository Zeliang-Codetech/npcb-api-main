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
};