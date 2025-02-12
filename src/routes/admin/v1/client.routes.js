import express from "express";
import ClientController from "./../../../controllers/admin/v1/ClientController.js";
const router = express.Router();
router.post("/", ClientController.addClient);
router.put("/:id", ClientController.updateClient);
router.get("/", ClientController.getClients);
router.delete("/:id", ClientController.deleteClient);
export default router;
