import express from "express";
import ComplaintController from "../../../controllers/client/v1/ComplaintController.js";
import upload from "./../../../middlewares/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), ComplaintController.addComplaint);
router.put("/:id", ComplaintController.updateComplaint);
router.get("/", ComplaintController.getMyComplaints);
router.get("/view/:id", ComplaintController.getComplaintById); // New route for getComplaintById

export default router;
