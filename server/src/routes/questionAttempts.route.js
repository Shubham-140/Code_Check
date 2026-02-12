import { Router } from "express";
import { userAttempt } from "../controllers/questionAttempts.controller.js";
const router=Router();
import {verifyJWT} from "../middlewares/jwt.middleware.js";

router.route("/").post(verifyJWT, userAttempt);

export default router;