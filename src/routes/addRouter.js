import { Router } from "express";
import {newEntry, newExit} from "../controllers/addController.js"

const addRouter = Router()

addRouter.post("/new-entry", newEntry)
addRouter.post("/new-exit", newExit)

export default addRouter