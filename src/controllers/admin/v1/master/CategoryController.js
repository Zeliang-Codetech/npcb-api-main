import createHttpError from "http-errors";
import Category from "../../../../models/master/Category.js";
import { isValidObjectId } from "../../../../utils/Helpers.js";
export default {
  addCategory: async (req, res, next) => {
    try {
      const data = await Category.create({ ...req.body }).catch((err) => {
        throw createHttpError.InternalServerError(err);
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
  updateCategory: async (req, res, next) => {
    try {
      const category_id = req.params.id;
      if (!isValidObjectId(category_id)) throw createHttpError.BadRequest();
      const category = await Category.findByIdAndUpdate(category_id, req.body, {
        new: true,
      });
      if (!category) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true });
    } catch (err) {
      res.status(err.status || 500).send({
        status: false,
        message: err.message,
      });
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const category_id = req.params.id;
      if (!isValidObjectId(category_id)) throw createHttpError.BadRequest();
      const deleted = await Category.findByIdAndRemove(category_id).catch(
        (err) => {
          throw createHttpError.InternalServerError();
        }
      );
      if (!deleted) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: err.message,
      });
    }
  },
  getCategories: async (req, res) => {
    try {
      const data = await Category.find({}).select("_id name").lean();
      res.status(200).send({ status: true, data });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
};
