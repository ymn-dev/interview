import express from "express";
import mysql from "mysql";
import mariadb from "mariadb";
import "dotenv/config";
import usersRouter from "./routers/usersRouter.js";
const app = express();

const pool = mariadb.createPool({
  host: process.env.MARIA_HOST,
  user: process.env.MARIA_USER,
  password: process.env.MARIA_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const connection = await pool
  .getConnection()
  .then(console.log("Successfully connected to the database"))
  .catch((err) => {
    console.log(`Error connecting to database: ${err}`);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.json({ message: `the server is up` });
  next();
});

app.use("/users", usersRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default connection;
