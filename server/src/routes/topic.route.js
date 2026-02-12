import { Router } from "express";
import { fetchTopics, generateTopic } from "../controllers/topic.controller.js";

const router=Router();

router.route("/").post(generateTopic);
router.route("/topics").get(fetchTopics);

export default router;