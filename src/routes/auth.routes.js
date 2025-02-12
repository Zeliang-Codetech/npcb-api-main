import express from "express";
import AuthController from "../../controllers/AuthController";
import JWT from "../../helpers/jwt";
import upload from "../../middlewares/upload";
const verifyOtpToken = JWT.verifyOtpToken;
const verifyUserAccessToken = JWT.verifyUserAccessToken;
const verifyResetPasswordToken = JWT.verifyResetPasswordToken;
const router = express.Router();
router.post("/admin/login", AuthController.login);
router.get("/admin", verifyUserAccessToken, AuthController.getAdmin);
router.post("/admin/logout", verifyUserAccessToken, AuthController.logout);
router.put(
  "/user/profile",
  verifyUserAccessToken,
  // upload.single("image"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  AuthController.updateProfile
);
router.get("/user", verifyUserAccessToken, AuthController.getUser);
router.post("/user/otp/send", AuthController.sentOtp);
router.post("/user/otp/verify", AuthController.verifyOtp);
export default router;
