import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/", authController.login);
router.patch("/reset-password", authController.resetPassword);
router.patch("/new-password", authController.newPassword);

export default router;
