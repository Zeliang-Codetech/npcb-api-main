import express from "express";
import HelpSupportController from "../../../controllers/admin/v1/HelpSupportController.js";

const router = express.Router();

router.get("/", HelpSupportController.getHelpSupport);
router.put("/", HelpSupportController.updateHelpSupport);

export default router;