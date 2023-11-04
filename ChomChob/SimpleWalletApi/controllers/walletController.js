import connection from "../server.js";
import crypto from "crypto";

export const adminAddToWallet = async (req, res, next) => {
  const { user_id, currency, amount } = req.body;
  const getUser = `SELECT * FROM users where user_id = ?`;
  try {
    const user = await connection.query(getUser, [user_id]);
    if (user.length === 0) res.status(400).json({ error: "User doesn't exist" });
    const myUser = user[0];
    const wallet = `wallet_${currency.toLowerCase()}`;
    // console.log(myUser);
    if (!(wallet in myUser)) res.status(400).json({ error: "This currency isn't available yet" });
    const updateQuery = `UPDATE users SET ${wallet} = ${wallet} + ? WHERE user_id = ?`;
    const values = [Number(amount), myUser.user_id];
    await connection.query(updateQuery, values);
    res.json({ message: "Added to the wallet successfully" });
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage });
  } finally {
    connection.release();
  }
};
