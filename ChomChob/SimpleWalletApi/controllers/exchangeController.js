import crypto from "crypto";
import { connection } from "../server.js";

export const getExchangeRates = async (req, res, next) => {
  const query = `
  SELECT
    e.id,
    c1.abbreviation AS from_currency,
    c2.abbreviation AS to_currency,
    e.rate,
    CASE
        WHEN e.available = 1 THEN "TRUE"
        ELSE "AVAILABLE SOON"
    END AS available
  FROM exchange_rate e
  JOIN currency c1 ON e.from_currency = c1.currency_id
  JOIN currency c2 ON e.to_currency = c2.currency_id
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

/*depreciated because automated in add currency already*/
export const addExchangeRate = async (req, res, next) => {
  const { from_currency, to_currency, rate, available } = req.body;
  if (rate < 0) {
    res.status(400).json({ error: "Rate cannot be lower than 0" });
    return;
  }
  const query = `INSERT INTO exchange_rate (from_currency, to_currency,rate,available) VALUES (?, ?, ?, ?);`;
  let availability;
  if (available.toLowerCase() === "true" || available == 1) availability = 1;
  if (available.toLowerCase() === "false" || available == 0 || !available) availability = 0;
  const value = [from_currency, to_currency, rate, availability];
  try {
    await connection.query(query, value);
    res.status(200).json({ message: "Added new exchange successfully" });
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage });
  } finally {
    connection.release();
  }
};

export const modifyExchangeRate = async (req, res, next) => {
  const { exchange_id, rate, available } = req.body;
  if (rate < 0) {
    res.status(400).json({ error: "Rate cannot be lower than 0" });
    return;
  }
  const query = `UPDATE exchange_rate SET rate = ?, available = ? WHERE id = ?`;
  let availability;
  if (available.toLowerCase() === "true" || available == 1) availability = 1;
  if (available.toLowerCase() === "false" || available == 0 || !available) availability = 0;
  const value = [rate, availability, exchange_id];
  try {
    await connection.query(query, value);
    res.json({ message: "Successfully modified an exchange rate" });
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage });
  } finally {
    connection.release();
  }
};

export const deleteExchangeRate = async (req, res, next) => {
  const { exchange_id } = req.body;
  const query = `DELETE FROM exchange_rate where id = ?;`;
  try {
    await connection.query(query, [exchange_id]);
    res.json({ message: "Successfully deleted an exchange" });
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage });
  } finally {
    connection.release();
  }
};
