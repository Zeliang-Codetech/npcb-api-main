import express from "express";
import HelpSupportController from "../../../controllers/client/v1/HelpSupportController.js";

const router = express.Router();

router.get("/", HelpSupportController.getHelpSupport);

export default router;