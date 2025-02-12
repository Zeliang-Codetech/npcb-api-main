import express from "express";
const router = express.Router();
import adminRoutes from "./admin.routes.js";
import clientRoutes from "./client.routes.js";
router.use("/client", clientRoutes);
router.use("/admin", adminRoutes);
export default router;
