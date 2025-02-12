import express from "express";
const router = express.Router();
import cityRoutes from "./city.routes.js";
import categoryRoutes from "./category.routes.js";
import complaintRoutes from "./complaint.routes.js";
router.use("/city", cityRoutes);
router.use("/category", categoryRoutes);
router.use("/complaint", complaintRoutes);
export default router;
