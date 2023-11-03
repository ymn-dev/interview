import crypto from "crypto";
import connection from "../server.js";

export const getExchangeRates = async (req, res, next) => {
  const query = `
  SELECT
    e.id,
    c1.currency_id AS from_currency,
    c2.currency_id AS to_currency,
    e.rate,
    e.available
  FROM exchange_rate e
  JOIN currencies c1 ON e.from_currency = c1.currency_id
  JOIN currencies c2 ON e.to_currency = c2.currency_id
  WHERE e.available = TRUE
  ORDER BY 1 ASC;`;
  try {
    const result = await connection.query(query);
    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ error: { err } });
  } finally {
    connection.release();
  }
};

export const addExchangeRate = async (req, res, next) => {
  const { from_currency, to_currency, rate, available } = req.body;
  try {
    const checkExchangeExists = `SELECT * from exchange_rate`;
    const records = await connection.query(checkExchangeExists);
    const exist = records.filter((record) => record.from_currency === from_currency && record.to_currency === to_currency);
    if (exist.length > 0) {
      res.status(400).json({ error: "This exchange already exist" });
      return;
    }
    const query = `INSERT INTO exchange_rate (from_currency, to_currency, rate, available) VALUES (?,?,?,?)`;
    const booleanAvailable = available === "false" ? false : true;
    const values = [from_currency, to_currency, rate, booleanAvailable];
    await connection.query(query, values);
    res.status(200).json({ message: "Added new exchange successfully" });
  } catch (err) {
    res.status(400).json({ error: err });
  } finally {
    connection.release();
  }
};
