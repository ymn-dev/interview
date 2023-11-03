import { isValidEmail } from "../utils/validators.js";
import crypto from "crypto";
import { bcryptHash } from "../utils/encryption.js";
import connection from "../server.js";

export const addUser = async (req, res, next) => {
  try {
    const { user_name, email, password } = req.body;
    if (user_name.startsWith("admin")) {
      res.status(400).json({ error: "Invalid username" });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ error: "Invalid Email" });
      return;
    }
    const user_id = crypto.randomUUID();
    const hashedPassword = await bcryptHash(password);
    const query = "INSERT INTO users (user_id, user_name, email, password) VALUES (?,?,?,?)";
    const values = [user_id, user_name, email, hashedPassword];
    try {
      await connection.query(query, values);
      res.status(200).json({ message: "User inserted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.sqlMessage });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`error occured: ${err}`);
    res.status(500).json({ error: err });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const getAllColumns = "DESCRIBE users";
    let allColumns = [];
    const table = await connection.query(getAllColumns);
    table.forEach((column) => {
      allColumns.push(column.Field);
    });
    const noPassword = allColumns.filter((col) => col !== "password").join(", ");
    const query = `SELECT ${noPassword} from users`;
    const result = await connection.query(query);

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage });
  } finally {
    connection.release();
  }
};
