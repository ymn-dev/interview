import { connection } from "../server.js";
import crypto from "crypto";

export const adminAddMoney = async (req, res, next) => {
  const { wallet_id, user_id, currency_id, amount } = req.body;
  if (wallet_id && amount && !user_id && !currency_id) {
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
  } else if (!wallet_id && currency_id && user_id) {
    if (Number(amount < 0)) return res.status(400).json({ error: "Can't create a wallet with minus balance" });
    const newWalletId = crypto.randomUUID();
    const query = `INSERT into wallet (wallet_id, user_id, currency_id, balance) VALUES (?, ?, ?, ?)`;
    const value = [newWalletId, user_id, Number(currency_id), amount ? Number(amount) : 0];
    try {
      await connection.query(query, value);
      res.json({ message: `Successfully created and add money to the wallet` });
    } catch (err) {
      res.status(400).json({ error: err.sqlMessage });
    } finally {
      connection.release();
    }
  } else {
    res.status(400).json({ error: "either send 'wallet_id + amount' for existing wallet or 'user_id + currency_id + amount(optional)' to create new wallet" });
  }
};

export const walletTransaction = async (req, res, next) => {
  const { from_wallet, to_user, to_currency, amount } = req.body;
  if (amount <= 0) {
    //take amount from wallet currency then push through exchange later
    res.status(400).json({ error: "Cannot transfer amount 0 or lower" });
  }
  const payerQuery = `SELECT * from wallet where wallet_id = ?`;
  try {
    const payerWallet = await connection.query(payerQuery, [from_wallet]);
    const payerBalance = Number(payerWallet[0].balance) || 0;
    if (payerWallet[0].currency_id === to_currency) {
      if (Number(amount) > payerBalance) {
        res.status(400).json({ error: "You don't have the required amount in your wallet" });
        return;
      }
    }
    if (payerWallet[0].user_id !== req.id) {
      return res.status(403).json({ error: "You don't have access to this wallet" });
    }
    const getExchangeRateQuery = `SELECT * FROM exchange_rate where from_currency = ? AND to_currency = ? AND available = 1`;
    const getExchangeRate = await connection.query(getExchangeRateQuery, [payerWallet[0].currency_id, Number(to_currency)]);
    if (getExchangeRate.length === 0) return res.status(400).json({ error: "This exchange isn't available yet" });
    const exchangeRate = getExchangeRate.length > 0 ? Number(getExchangeRate[0].rate) : 1;
    const transferAmount = Number(amount) * exchangeRate;
    if (transferAmount > payerBalance * exchangeRate) {
      res.status(400).json({ error: "You don't have the required amount in your wallet" });
      return;
    }

    const receiverQuery = `SELECT * from wallet where user_id = ? AND currency_id = ?`;
    const receiverWallet = await connection.query(receiverQuery, [to_user, Number(to_currency)]);
    const updatePayerWalletQuery = `UPDATE wallet SET balance = ? WHERE wallet_id = ?;`;
    const updatePayerWallet = await connection.query(updatePayerWalletQuery, [payerBalance - Number(amount), from_wallet]);
    if (receiverWallet.length === 0) {
      const newWalletId = crypto.randomUUID();
      const query = `INSERT into wallet (wallet_id, user_id, currency_id, balance) VALUES (?, ?, ?, ?)`;
      const value = [newWalletId, to_user, to_currency, transferAmount];
      await connection.query(query, value);
    } else {
      const receivingQuery = "UPDATE wallet SET balance = balance + ? WHERE wallet_id = ?;";
      await connection.query(receivingQuery, [transferAmount, receiverWallet[0].wallet_id]);
    }
    res.json({ message: "Successfully transferred money" });
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage });
  } finally {
    connection.release();
  }
};
