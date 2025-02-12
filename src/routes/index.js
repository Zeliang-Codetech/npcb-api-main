import express from "express";
import JWT from "./../helpers/jwt.js";
const verifyAdminAccessToken = JWT.verifyAdminAccessToken;
const verifyClientAccessToken = JWT.verifyClientAccessToken;

import adminRoutes from "./admin/index.js";
import authRoutes from "./auth/index.js";
import clientRoutes from "./client/index.js";
import moment from "moment";
const router = express.Router();
router.use("/admin", verifyAdminAccessToken, adminRoutes);
router.use("/auth", authRoutes);
router.use("/client", verifyClientAccessToken, clientRoutes);
export default router;
