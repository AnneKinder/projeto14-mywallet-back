import { movementsColl } from "../index.js";

export async function newEntry(req, res) {
  try {
    await movementsColl.insertOne(req.body);
    res.status(201).send("Entry sent.");
  } catch (err) {
    console.log(err);
  }
}

export async function newExit(req, res) {
  try {
    await movementsColl.insertOne(req.body);
    console.log(req.body);
    res.status(201).send("Exit sent.");
  } catch (err) {
    console.log(err);
  }
}
