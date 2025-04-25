import express from "express";
import ComplaintController from "../../../controllers/admin/v1/ComplaintController.js";
const router = express.Router();

router.post("/", ComplaintController.addComplaint);
router.put("/", ComplaintController.updateComplaint);
router.get("/", ComplaintController.getComplaints);
router.get("/:id", ComplaintController.getComplaintById);
router.delete("/:id", ComplaintController.deleteComplaint);
router.put("/:id/status", ComplaintController.updateComplaintStatus);

export default router;
