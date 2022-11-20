import { Router } from "express";
import {newEntry, newExit} from "../controllers/addController.js"
import { movementValidationMiddleware } from "../middlewares/schemaValidationMiddleware.js";

const addRouter = Router()

addRouter.post("/new-entry",movementValidationMiddleware , newEntry)
addRouter.post("/new-exit",movementValidationMiddleware, newExit)

export default addRouter