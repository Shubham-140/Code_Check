import { Router } from "express";
import { generateQuiz } from "../controllers/quiz.controller.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router = Router();

router.route("/generate").post(verifyJWT, generateQuiz);

export default router;