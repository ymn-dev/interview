import { isValidEmail } from "../utils/validators.js";
import crypto from "crypto";
import { connection } from "../server.js";
import { bcryptHash } from "../utils/encryption.js";

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
    const query = "INSERT INTO user (user_id, user_name, email, password, pwt) VALUES (?,?,?,?,?)";
    const pwt = crypto.randomUUID();
    const values = [user_id, user_name, email, hashedPassword, pwt];
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
  const { perPage, page } = req.body;
  try {
    const getAllUsersWithWallets = `
    SELECT limit_by_user.user_id, c.abbreviation as currency, w.balance, w.wallet_id
    FROM (
    SELECT DISTINCT user_id
    FROM user
    LIMIT 20
    OFFSET 0
    ) AS limit_by_user 
    JOIN wallet w ON limit_by_user.user_id = w.user_id
    JOIN currency c ON w.currency_id = c.currency_id
    GROUP BY 1, 2;
`;

    const pagination = [Number(perPage), Number(perPage) * Number(page - 1)];
    const table = await connection.query(getAllUsersWithWallets, pagination);
    res.json({ data: table });
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage });
  } finally {
    connection.release();
  }
};
