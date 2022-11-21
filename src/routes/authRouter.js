import { Router } from "express";
import { signUp, signIn } from "../controllers/authController.js";
import {
  signUpValidationMiddleware,
  signinValidationMiddleware,
} from "../middlewares/schemaValidationMiddleware.js";

const authRouter = Router();

authRouter.post("/sign-up", signUpValidationMiddleware, signUp);
authRouter.post("/", signinValidationMiddleware, signIn);

export default authRouter;
