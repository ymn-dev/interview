import express from "express";
import mysql from "mysql";
import "dotenv/config";
import usersRouter from "./routers/usersRouter.js";
const app = express();

const connection = mysql.createConnection({
  user: process.env.DATABASE_ID,
  password: process.env.DATABASE_PASSWORD,
  database: "chomchob",
  host: "localhost",
});

const connectionLoop = async () => {
  connection.connect((err) => {
    if (err) {
      console.log(`Error connecting to database: ${err}`);
      setTimeout(connectionLoop, 5000);
    } else {
      console.log("Successfully connected to the database");
    }
  });
};

connectionLoop();
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
