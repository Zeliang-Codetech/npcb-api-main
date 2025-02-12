import express from "express";
import JWT from "../../helpers/jwt.js";
const verifyUserAccessToken = JWT.verifyUserAccessToken;
const router = express.Router();
import v1Routes from "./v1/index.js";
router.use("/v1", v1Routes);
export default router;
