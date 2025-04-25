import express from "express";
import AuthController from "../../../controllers/auth/v1/ClientAuthController.js";

const router = express.Router();

router.post("/otp/send", AuthController.sentOtp);
router.post("/otp/verify", AuthController.verifyOtp);

export default router;