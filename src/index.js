import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { signIn, signUp } from "./controllers/authController.js";
import { getFeed } from "./controllers/feedController.js";

//config:
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

//mongo:
const mongoClient = new MongoClient(process.env.MONGO_URI);
try {
  await mongoClient.connect();
} catch (err) {
  console.log(err);
}

export const db = mongoClient.db("wallet");

//globals
export const usersColl = db.collection("users");
export const sessionsColl = db.collection("sessions");
export const movementsColl = db.collection("movements");

//schemas
 export const signupSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: joi.required(),
  confirmp: joi.required(),
});

export const signinSchema = joi.object({
  email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: joi.required(),
});

export const movementSchema = joi.object({
  valor: joi.number().required(),
  descricao: joi.required(),
});

//routes
app.post("/sign-up", signUp);

app.post("/", signIn);

app.post("/new-entry", async (req, res) => {
  const validation = movementSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send("Preencha os campos corretamente");
    console.log(errors);
    return;
  }

  try {
    await movementsColl.insertOne({ ...req.body, type: "entry" });
    res.status(201).send("Entry sent.");
  } catch (err) {
    console.log(err);
  }
});

app.post("/new-exit", async (req, res) => {
    const validation = movementSchema.validate(req.body, { abortEarly: false });
  
    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      res.status(422).send("Preencha os campos corretamente");
      console.log(errors);
      return;
    }
  
    try {
      await movementsColl.insertOne({ ...req.body, type: "exit" });
      res.status(201).send("Exit sent.");
    } catch (err) {
      console.log(err);
    }
  });

app.get("/feed", getFeed)


app.listen(process.env.PORT, () =>
  console.log(`Server running on port: ${process.env.PORT}.`)
);
