import createHttpError from "http-errors";
import JWT from "./../../../helpers/jwt.js";
import bcrypt from "bcrypt";
import {
  AuthSchema,
  AuthRegisterSchema,
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
      await AuthSchema.validateAsync(req.body).catch((error) => {
        throw createHttpError.BadRequest();
      });

      const { phone, password, fcm_token } = req.body;
      const user = await User.findOne({
        phone: phone,
      }).catch((err) => {
        throw createHttpError.InternalServerError();
      });

      if (!user)
        throw createHttpError.Unauthorized("Username/password not valid"); // User not registered
      // if (user && (await user.isValidPassword(plainTextPassword))) { }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw createHttpError.Unauthorized("Username/password not valid");
      const accessToken = await signAccessToken(user._id);
      const refreshToken = await signRefreshToken(user._id);
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        // sameSite: "None",
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
