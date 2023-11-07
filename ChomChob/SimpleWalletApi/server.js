import express from "express";
import mariadb from "mariadb";
import "dotenv/config";
import usersRouter from "./routers/usersRouter.js";
import exchangeRouter from "./routers/exchangesRouter.js";
import walletsRouter from "./routers/walletsRouter.js";
import currenciesRouter from "./routers/currenciesRouter.js";
import loginRouter from "./routers/loginRouter.js";

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

app.use("/login", loginRouter);

app.get("/", (req, res, next) => {
  res.json({ message: `the server is up` });
  next();
});

app.use("/users", usersRouter);
app.use("/exchange", exchangeRouter);
app.use("/wallet", walletsRouter);
app.use("/currency", currenciesRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { connection };
