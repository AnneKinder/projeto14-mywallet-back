import { movementSchema, movementsColl  } from "../index.js";

export async function newEntry (req, res) {
    try {
      await movementsColl.insertOne({ ...req.body, type: "entry" });
      res.status(201).send("Entry sent.");
    } catch (err) {
      console.log(err);
    }
  }

  export async function newExit (req, res) {
  
    try {
      await movementsColl.insertOne({ ...req.body, type: "exit" });
      res.status(201).send("Exit sent.");
    } catch (err) {
      console.log(err);
    }
  }