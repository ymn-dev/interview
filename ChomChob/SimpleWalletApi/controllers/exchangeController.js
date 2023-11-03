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
  const query = `INSERT INTO exchange_rate `;
};
