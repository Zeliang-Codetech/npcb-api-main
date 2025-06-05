import express from "express";
import BulletinController from "../../../controllers/admin/v1/BulletinController.js";

const router = express.Router();

router.get("/", BulletinController.getBulletins);
router.get("/:id", BulletinController.getBulletinById);
router.post("/", BulletinController.createBulletin);
router.put("/:id", BulletinController.updateBulletin);
router.delete("/:id", BulletinController.deleteBulletin);

export default router;