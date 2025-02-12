import express from "express";
import ComplaintController from "../../../controllers/client/v1/ComplaintController";
const router = express.Router();
router.get("/", ComplaintController.getComplaints);
export default router;
