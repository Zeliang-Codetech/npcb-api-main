import express from "express";
import authRoutes from "./auth.routes.js";
import complaintRoutes from "./complaint.routes.js";
import cityRoutes from "./city.routes.js";
import categoryRoutes from "./category.routes.js";
import aboutUsRoutes from "./about-us.routes.js";
import bulletinRoutes from "./bulletin.routes.js";
import helpSupportRoutes from "./help-support.routes.js";
import ClientAuthController from "../../../controllers/auth/v1/ClientAuthController.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/complaint", complaintRoutes);
router.use("/city", cityRoutes);
router.use("/category", categoryRoutes);
router.use("/about-us", aboutUsRoutes);
router.use("/bulletin", bulletinRoutes);
router.use("/help-support", helpSupportRoutes);

router.post("/otp/send", (req, res, next) => {
  ClientAuthController.sentOtp(req, res, next);
});

router.post("/otp/verify", (req, res, next) => {
  ClientAuthController.verifyOtp(req, res, next);
});

export default router;
