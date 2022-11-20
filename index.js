import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

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

let db = mongoClient.db("wallet");

//globals
const usersColl = db.collection("users");
const sessionsColl = db.collection("sessions");
const movementsColl = db.collection("movements");

//schemas
const signupSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: joi.required(),
  confirmp: joi.required(),
});

const signinSchema = joi.object({
  email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: joi.required(),
});

const movementSchema = joi.object({
  valor: joi.number().required(),
  descricao: joi.required(),
});

//routes
app.post("/sign-up", async (req, res) => {
  const { name, email, password, confirmp } = req.body;

  const alreadyExists = await usersColl.findOne({ email: email });

  if (alreadyExists) {
    res.status(400).send("Email já cadastrado.");
    return;
  }

  if (password != confirmp) {
    res.status(400).send("As senhas não conferem!");
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const user = {
    name: name,
    email: email,
    password: passwordHash,
    confirmp: passwordHash,
  };

  const validation = signupSchema.validate(user, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send("Preencha os campos corretamente");
    console.log(errors);
    return;
  }

  try {
    await usersColl.insertOne({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    res.status(201).send("Created");
  } catch (err) {
    console.log(err);
  }
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;
  const token = uuidV4();

  const validation = signinSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send("Preencha os campos corretamente");
    console.log(errors);
    return;
  }

  const user = await usersColl.findOne({ email });
  const userId = user._id

  if (user && bcrypt.compareSync(password, user.password)) {
    await sessionsColl.insertOne({
      token,
      userId: user._id,
    });

    res.send({ user, token });
  } else {
    res.status(401).send("Usuário ou senha incorretos.");
  }
});

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

app.get("/feed", async (req, res) => {
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer", "")

    if(!token){
        res.sendStatus(500)
        return
    }  

    const session = await sessionsColl.find({token})

    if(!session){
        res.status(401).send(token)
        
        return
    }

    const moveArray = await movementsColl.find()
    if(moveArray){
        res.send(moveArray)
    }else{
    res.sendStatus(401)
    }



})


app.listen(process.env.PORT, () =>
  console.log(`Server running on port: ${process.env.PORT}.`)
);
