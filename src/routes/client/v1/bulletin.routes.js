import express from "express";
import BulletinController from "../../../controllers/client/v1/BulletinController.js";

const router = express.Router();

router.get("/", BulletinController.getBulletins);
router.get("/:id", BulletinController.getBulletinById);

export default router;