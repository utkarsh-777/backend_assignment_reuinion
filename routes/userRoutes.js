import express from "express";
const router = express.Router();

import requireLogin from "../middlewares/requireLogin.js";
import userController from "../controllers/userController.js";

router.patch('/follow/:user_id', requireLogin, userController.follow_user);
router.patch('/unfollow/:user_id', requireLogin, userController.unfollow_user);
router.get('/user', requireLogin, userController.get_user);

export default router;