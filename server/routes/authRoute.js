import express from "express";
import {
  claimController,
  loginController,
  registerController,
} from "../controller/authController.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/signup", registerController);
router.post("/claim", claimController);

export default router;
