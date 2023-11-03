import crypto from "crypto";
import connection from "../server.js";

export const seeExchangeRate = async (req, res, next) => {
  const query = `
  SELECT
    e.id,
    c1.currency_code AS from_currency_code,
    c2.currency_code AS to_currency_code,
    e.rate,
    e.available
  FROM exchange_rate e
  JOIN currencies c1 ON e.from_currency = c1.currency_id
  JOIN currencies c2 ON e.to_currency = c2.currency_id
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
