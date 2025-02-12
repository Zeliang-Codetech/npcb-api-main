import express from "express";
import CityController from "./../../../controllers/admin/v1/master/CityController.js";
const router = express.Router();
router.get("/", CityController.getCities);
export default router;
