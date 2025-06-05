import express from "express";
import AboutUsController from "../../../controllers/admin/v1/AboutUsController.js";

const router = express.Router();

router.get("/", AboutUsController.getAboutUs);
router.put("/", AboutUsController.updateAboutUs);

export default router;