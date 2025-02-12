import express from "express";
const router = express.Router();
import categoryRoutes from "./category.routes.js";
import cityRoutes from "./city.routes.js";
router.use("/category", categoryRoutes);
router.use("/city", cityRoutes);
export default router;
