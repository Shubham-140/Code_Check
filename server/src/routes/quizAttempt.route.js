import { saveQuizAttempt, fetchAttemptedQuiz, fetchQuizAttemptedHistory } from "../controllers/quizAttempt.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router = Router();

router.route("/save").post(verifyJWT, saveQuizAttempt);
router.route("/quizHistory").post(verifyJWT, fetchQuizAttemptedHistory);
router.route("/fetch/:quizId").get(verifyJWT, fetchAttemptedQuiz);

export default router;