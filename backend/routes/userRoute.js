import express from "express"
import { getAllUsers, login, logout, register, updateProfileInfo } from "../controllers/userController.js";

const router = express.Router();

// register -> login || logout
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateInfo").post(updateProfileInfo);
router.route("/logout").get(logout);
router.route("/getAll").get( getAllUsers)

export default router;