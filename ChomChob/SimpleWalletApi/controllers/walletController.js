import connection from "../server.js";
import crypto from "crypto";

export const adminAddMoney = async (req, res, next) => {
  const { wallet_id, user_id, currency_id, amount } = req.body;
  if (wallet_id && amount) {
    const query = `UPDATE wallet SET balance = balance + ? WHERE wallet_id = ?`;
    const value = [Number(amount), wallet_id];
    try {
      await connection.query(query, value);
      res.json({ message: "Successfully add money to the wallet" });
    } catch (err) {
      res.status(400).json({ error: err.sqlMessage });
    } finally {
      connection.release();
    }
  } else {
    const newWalletId = crypto.randomUUID();
    const query = `INSERT into wallet (wallet_id, user_id, currency_id, balance) VALUES (?, ?, ?, ?)`;
    const value = [newWalletId, user_id, Number(currency_id), Number(amount)];
    try {
      await connection.query(query, value);
      res.json({ message: `Successfully created the wallet ${newWalletId}` });
    } catch (err) {
      res.status(400).json({ error: err.sqlMessage });
    } finally {
      connection.release();
    }
  }
};

export const walletTransaction = async (req, res, next) => {
  const {} = req.body;
};
