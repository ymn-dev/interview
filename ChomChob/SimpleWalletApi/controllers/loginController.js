import { connection } from "../server.js";
import { bcryptCompare } from "../utils/encryption.js";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  const getUserQuery = `select user_id, password from user where user_name = ?;`;
  try {
    const myUser = await connection.query(getUserQuery, [username]);
    if (myUser.length === 0) res.status(400).json({ error: "User doesn't exist" });
    const passwordFromBuffer = Buffer.from(myUser[0].password).toString();
    const result = await bcryptCompare(password, passwordFromBuffer);
    if (!result) res.status(400).json({ error: "Wrong password" });
    const token = jwt.sign(
      {
        user_id: myUser[0].user_id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    //token response is only for testing
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.json({ error: err.sqlMessage });
    connection.release();
  }
};
