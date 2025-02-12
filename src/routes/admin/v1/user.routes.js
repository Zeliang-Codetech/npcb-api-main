import express from "express";
import UserController from "../../../controllers/admin/v1/UserController.js";
const router = express.Router();
router.post("/", UserController.addUser);
router.put("/:id", UserController.updateUser);
router.get("/", UserController.getUsers);
router.delete("/:id", UserController.deleteUser);
export default router;
