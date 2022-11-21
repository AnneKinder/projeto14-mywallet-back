import { Router } from "express";
import { getFeed } from "../controllers/feedController.js";

const feedRouter = Router();

feedRouter.get("/feed", getFeed);

export default feedRouter;
