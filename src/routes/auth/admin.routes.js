import express from "express";
import AuthController from "./../../controllers/auth/v1/AdminAuthController.js";
import JWT from "../../helpers/jwt.js";
const verifyAccessToken = JWT.verifyAdminAccessToken;
const router = express.Router();
router.post("/login", AuthController.login);
router.get("/", verifyAccessToken, AuthController.getUser);
router.post("/logout", verifyAccessToken, AuthController.logout);
export default router;
