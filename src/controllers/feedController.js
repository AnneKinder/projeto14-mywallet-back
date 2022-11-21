import { sessionsColl, movementsColl, usersColl } from "../index.js";

export async function getFeed(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    res.sendStatus(500);
    return;
  }

  const session = await sessionsColl.findOne({ token });
  console.log(session);
  if (!session) {
    res.sendStatus(401);
    return;
  }

  const userId = session.userId;
  const user = await usersColl.findOne({ _id: userId });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  const userEmail = user.email;

  const movesArray = await movementsColl.find({ email: userEmail }).toArray();

  if (movesArray) {
    res.send(movesArray);
  } else {
    res.sendStatus(401);
  }
}
