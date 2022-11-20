import { movementSchema, movementsColl  } from "../index.js";

export async function newEntry (req, res) {
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
  }

  export async function newExit (req, res) {
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
  }