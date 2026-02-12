import { Router } from "express";
import { generateQuestion } from "../controllers/question.controller.js";

const router=Router();

router.route("/").post(generateQuestion);

export default router;