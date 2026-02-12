import { Router } from "express";
import { deleteUser, getUser, editUserDetails, getMe } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router=Router();

router.route("/updateMe").put(verifyJWT, editUserDetails);
router.route("/deleteMe").delete(verifyJWT, deleteUser);
router.route("/me").get(verifyJWT, getMe);
router.route("/:username").get(getUser);

export default router;