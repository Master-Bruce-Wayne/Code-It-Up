import express from "express"
import { login, logout, register, updateProfileInfo } from "../controllers/userController.js";

const router = express.Router();

// register -> login || logout
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateInfo").post(updateProfileInfo);
router.route("/logout").get(logout);

export default router;