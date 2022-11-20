import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import {usersColl, sessionsColl,signupSchema } from "../index.js"

export async function signUp (req, res){
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
  }

export async function signIn (req, res) {
    const { email, password } = req.body;
    const token = uuidV4();
  
    // const validation = signinSchema.validate(req.body, { abortEarly: false });
  
    // if (validation.error) {
    //   const errors = validation.error.details.map((detail) => detail.message);
    //   res.status(422).send("Preencha os campos corretamente");
    //   console.log(errors);
    //   return;
    // }
  
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
  }