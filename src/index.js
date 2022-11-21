import express from "express";
import cors from "cors";
import db from "./db.js"
import joi from "joi";
import { newEntry, newExit } from "./controllers/addController.js";
import authRouter from './routes/authRouter.js';
import feedRouter from "./routes/feedRouter.js";
import addRouter from "./routes/addRouter.js";

//config:
const app = express();
app.use(express.json());
app.use(cors());

//globals
export const usersColl = db.collection("users");
export const sessionsColl = db.collection("sessions");
export const movementsColl = db.collection("movements");

//schemas
// export const signupSchema = joi.object({
// name: joi.string().required(),
// email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
// password: joi.required(),
// confirmp: joi.required(),
// });

//routes
app.use(authRouter)
app.use(addRouter)
app.use(feedRouter)


app.listen(process.env.PORT, () =>
  console.log(`Server running on port: ${process.env.PORT}.`)
);
