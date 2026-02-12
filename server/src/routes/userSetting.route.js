import { changeUserSettings, getUserSettings } from "../controllers/userSetting.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router = Router();

router.route("/update").post(verifyJWT, changeUserSettings);
router.route("/fetchUserSettings").get(verifyJWT, getUserSettings);

export default router;