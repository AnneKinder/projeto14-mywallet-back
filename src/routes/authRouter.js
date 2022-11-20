import { Router } from "express";
import { signUp, signIn } from "../controllers/authController.js";
import { signUpValidationMiddleware } from "../middlewares/schemaValidationMiddleware.js";

const authRouter = Router()

authRouter.post("/sign-up", signUp)
authRouter.post("/", signIn)

export default authRouter


