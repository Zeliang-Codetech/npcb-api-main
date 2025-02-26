import createHttpError from "http-errors";
import JWT from "./../../../helpers/jwt.js";
import bcrypt from "bcrypt";
import {
  AuthSchema,
  AuthRegisterSchema,
} from "./../../../validators/AuthValidator.js";
import Client from "./../../../models/Client.js";
// import { SentOtp, VerifyOtp } from "../utils/Fcm.js";
const signAccessToken = JWT.signClientAccessToken;
// const signRefreshToken = JWT.signClientRefreshToken;
export default {
  register: async (req, res, next) => {
    try {
      await AuthRegisterSchema.validateAsync(req.body).catch((err) => {
        throw createHttpError.BadRequest();
      });
      const { phone, password, name, email = "" } = req.body;
      // await User.deleteOne({ phone, status: 0 });
      const isUserExists = await Client.findOne({ phone });
      if (isUserExists)
        throw createHttpError.Conflict(`${phone} is already been registerd`);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Client.findOneAndUpdate(
        { phone },
        {
          name: name,
          phone: phone,
          email,
          password: hashedPassword,
        },
        { upsert: true, new: true }
      ).catch((err) => {
        throw createHttpError.InternalServerError(err);
      });
      if (!user) throw createHttpError.InternalServerError();
      const accessToken = await signAccessToken(user._id);
      const refreshToken = await signRefreshToken(user._id);
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: false,
        maxAge: 1 * 24 * 60 * 60 * 1000,
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
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
  login: async (req, res, next) => {
    try {
      await AuthSchema.validateAsync(req.body).catch((data) => {
        throw createHttpError.BadRequest();
      });
      const { phone, password, fcm_token } = req.body;
      const user = await Client.findOne({
        phone,
        status: 0,
        role: UserRole.ADMIN,
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
      const data = await Client.findOne(
        { _id: user_id, account_status: AccountStatus.ACTIVE },
        "name phone image verification_status ngo_verification_status user_document_front user_document_back ngo_document_front ngo_document_back user_document_type description"
      ).catch((err) => {
        throw createHttpError.InternalServerError(err);
      });
      if (!data) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true, data });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      console.log(req.body);
      if (!refreshToken) throw createHttpError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      res.send({
        status: true,
        accessToken: accessToken,
        refreshToken: refToken,
      });
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      // Delete refresh token from table refresh token after logout
      res.clearCookie("token").status(200).send({ status: true });
    } catch (err) {
      res.status(500).send({ status: false });
    }
  },

  sentOtp: async (req, res, next) => {
    try {
      const { phone } = req.body;

      if (!phone) {
        throw createHttpError.BadRequest("Phone number is required");
      }

      // Generate a random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const session_id = Date.now().toString();

      console.log(`OTP for ${phone}: ${otp}`);

      res.status(200).send({
        status: true,
        session_id,
        message: "OTP sent successfully"
      });
    } catch (err) {
      console.error("Send OTP Error:", err);
      res.status(err.status || 500).send({
        status: false,
        message: err.message || "Failed to send OTP"
      });
    }
  },

  verifyOtp: async (req, res, next) => {
    try {
      const { phone, otp, session_id } = req.body;

      if (!phone || !otp || !session_id) {
        throw createHttpError.BadRequest("Missing required fields");
      }

      const isValidOTP = true;

      if (!isValidOTP) {
        throw createHttpError.Unauthorized("Invalid OTP");
      }

      // Find or create user
      let user = await Client.findOne({ phone });

      if (!user) {
        user = await Client.create({
          phone,
          name: "",
          status: 1 
        });
      }

      const accessToken = await signAccessToken(user._id);

      res.status(200).send({
        status: true,
        accessToken,
        user: {
          name: user.name,
          phone: user.phone,
          _id: user._id
        }
      });
    } catch (err) {
      console.error("Verify OTP Error:", err);
      res.status(err.status || 500).send({
        status: false,
        message: err.message || "Failed to verify OTP"
      });
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { password } = req.body;
      const consumerId = req.payload._id;
      if (!password) throw createHttpError.BadRequest();
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = await Client.update(
        {
          password: hashedPassword,
        },
        {
          where: { _id: consumerId },
        }
      ).catch((err) => {
        throw createHttpError.InternalServerError();
      });
      if (!data) throw createHttpError.InternalServerError();
      res.status(200).send({ status: true });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ status: false, message: err.message });
    }
  },
};
