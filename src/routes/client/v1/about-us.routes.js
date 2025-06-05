import express from "express";
import AboutUsController from "../../../controllers/client/v1/AboutUsController.js";

const router = express.Router();

router.get("/", AboutUsController.getAboutUs);

export default router;