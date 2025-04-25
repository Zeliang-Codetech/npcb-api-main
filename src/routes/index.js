import express from "express";
import JWT from "./../helpers/jwt.js";
const verifyAdminAccessToken = JWT.verifyAdminAccessToken;
const verifyClientAccessToken = JWT.verifyClientAccessToken;

import adminRoutes from "./admin/index.js";
import authRoutes from "./auth/index.js";
import clientRoutes from "./client/index.js";
import clientAuthRoutes from "./client/v1/auth.routes.js";

const router = express.Router();

// Public auth routes
router.use("/auth", authRoutes);
router.use("/client/v1/auth", clientAuthRoutes);

// Protected routes
router.use("/admin", verifyAdminAccessToken, adminRoutes);
router.use("/client", (req, res, next) => {
  // Skip auth middleware for OTP routes
  if (req.path.startsWith('/v1/otp')) {
    return next();
  }
  verifyClientAccessToken(req, res, next);
}, clientRoutes);

export default router;
