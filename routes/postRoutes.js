import express from "express";
const router = express.Router();

import requireLogin from "../middlewares/requireLogin.js";
import postController from "../controllers/postController.js";

router.post("/upload-files", requireLogin, postController.uploadFiles);
router.get("/get-file/:bucket/:key", requireLogin, postController.getFile);

router.post("/posts", requireLogin, postController.createPost);
router.delete("/posts/:post_id", requireLogin, postController.delete_post);
router.patch("/like/:post_id", requireLogin, postController.like_post);
router.patch("/unlike/:post_id", requireLogin, postController.unlike_post);
router.patch("/comment/:post_id", requireLogin, postController.add_comment);
router.get("/posts/get/:post_id", requireLogin, postController.get_post);
router.get("/all_posts", requireLogin, postController.get_all_posts);

export default router;