import express from "express";
const router = express.Router();
import masterRoutes from "./master/index.js";
import userRoutes from "./user.routes.js";
import clientRoutes from "./client.routes.js";
import complaintRoutes from "./complaint.routes.js";
import aboutUsRoutes from "./about-us.routes.js";
import bulletinRoutes from "./bulletin.routes.js";

router.use("/master", masterRoutes);
router.use("/user", userRoutes);
router.use("/client", clientRoutes);
router.use("/complaint", complaintRoutes);
router.use("/about-us", aboutUsRoutes);
router.use("/bulletin", bulletinRoutes);

export default router;
