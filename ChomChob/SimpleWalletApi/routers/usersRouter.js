import express from "express";
import connection from "../server.js";
import crypto from "crypto";

const usersRouter = express.Router();

usersRouter.post("/", (req, res, next) => {
  try {
    const { user_name, email, password } = req.body;
    const user_id = crypto.randomUUID();
    const query = "INSERT INTO users (user_id, user_name, email, password) VALUES (?,?,?,?)";
    const values = [user_id, user_name, email, password];
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(`Error inserting user: ${err}`);
        res.status(500).json({ error: "Failed to insert user" });
      } else {
        res.status(201).json({ message: "User inserted successfully" });
      }
    });
  } catch (err) {
    console.error(`error occured: ${err}`);
  }
});

export default usersRouter;
