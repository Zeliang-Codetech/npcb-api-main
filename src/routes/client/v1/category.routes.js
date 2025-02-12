import express from "express";
import CategoryController from "../../../controllers/admin/v1/master/CategoryController.js";
const router = express.Router();
router.get("/", CategoryController.getCategories);
export default router;
