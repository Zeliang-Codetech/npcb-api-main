import express from "express";
import AuthController from "./../../controllers/auth/v1/ClientAuthController.js";
import JWT from "../../helpers/jwt.js";
const verifyAccessToken = JWT.verifyClientAccessToken;
const router = express.Router();
router.post("/otp/verify", AuthController.verifyOtp);
router.get("/", verifyAccessToken, AuthController.getUser);
router.post("/logout", verifyAccessToken, AuthController.logout);
export default router;
