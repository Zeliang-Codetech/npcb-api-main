import express from "express";
import ComplaintController from "../../../controllers/admin/v1/ComplaintController.js";
const router = express.Router();
router.post("/", ComplaintController.addComplaint);
router.put("/", ComplaintController.updateComplaint);
router.get("/", ComplaintController.getComplaints);
router.delete("/:id", ComplaintController.deleteComplaint);
export default router;
