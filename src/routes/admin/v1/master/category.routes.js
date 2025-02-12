import express from "express";
import CategoryController from "./../../../../controllers/admin/v1/master/CategoryController.js";
const router = express.Router();
router.post("/", CategoryController.addCategory);
router.put("/:id", CategoryController.updateCategory);
router.get("/", CategoryController.getCategories);
router.delete("/:id", CategoryController.deleteCategory);
export default router;
