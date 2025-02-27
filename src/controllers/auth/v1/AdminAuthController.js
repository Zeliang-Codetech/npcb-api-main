import createHttpError from "http-errors";
import JWT from "./../../../helpers/jwt.js";
import bcrypt from "bcrypt";
import {
  AuthSchema,
  AuthRegisterSchema,
  AdminAuthSchema,
} from "../../../validators/AuthValidator.js";

import User from "./../../../models/User.js";
// import Otp from "./../../../models/OtpModel.js";
import { isValidObjectId } from "../../../utils/Helpers.js";
const signAccessToken = JWT.signAdminAccessToken;
const signRefreshToken = JWT.signAdminRefreshToken;
const signOtpToken = JWT.signOtpToken;
export default {
  login: async (req, res, next) => {
    try {
      await AdminAuthSchema.validateAsync(req.body).catch((error) => {
        throw createHttpError.BadRequest();
      });

      const { phone, password } = req.body;
      const user = await User.findOne({
        phone: phone,
      }).catch((err) => {
        throw createHttpError.InternalServerError();
      });

      if (!user)
        throw createHttpError.Unauthorized("Phone/password not valid");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw createHttpError.Unauthorized("Phone/password not valid");

      const accessToken = await signAccessToken(user._id);
      const refreshToken = await signRefreshToken(user._id);

      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).send({
        status: true,
        user: {
          name: user.name,
          phone: user.phone,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: false, message: error.message });
    }
  },

  createUser: async (req, res, next) => {
    try {
      const { name, phone, password } = req.body;

      if (!phone || !password) {
        throw createHttpError.BadRequest("Phone and password are required");
      }

      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        throw createHttpError.BadRequest("User already exists");
      }

      const userData = {
        name,
        phone,
        password: await bcrypt.hash(password, 10),
      };

      const user = await User.create(userData);
      await user.save();

      res.status(200).send({
        status: true,
        message: "Admin user created successfully",
        user: {
          name: user.name,
          phone: user.phone,
        },
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: false, message: error.message });
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user_id = req.payload._id;

      if (!isValidObjectId(user_id)) throw createHttpError.BadRequest();
      const user = await User.findById(user_id).catch((err) => {
        throw createHttpError.InternalServerError();
      });
      if (!user) throw createHttpError.InternalServerError();
      res.status(200).send({
        status: true,
        user: {
          name: user.name,
          phone: user.primary_phone,
        },
      });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie("token").status(200).send({ status: true });
    } catch (err) {
      res.status(500).send({ status: false });
    }
  },
};
