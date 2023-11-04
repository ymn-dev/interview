import connection from "../server.js";

export const getAllCurrencies = async (req, res, next) => {
  const query = `SELECT * from currency`;
  try {
    const currencies = await connection.query(query);
    res.json({ data: currencies });
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage });
  } finally {
    connection.release();
  }
};

export const addCurrency = async (req, res, next) => {
  const { abbreviation, name } = req.body;
  const query = `INSERT INTO currency (abbreviation,name) VALUES (?, ?);`;
  try {
    await connection.query(query, [abbreviation, name]);
    const currentCurrencies = await connection.query(`SELECT * from currency;`);
    const newCurrency = currentCurrencies.pop();
    const exchangeQueries = [];
    currentCurrencies.forEach((currency) => {
      exchangeQueries.push(`(${newCurrency.currency_id},${currency.currency_id},0,0)`);
      exchangeQueries.push(`(${currency.currency_id},${newCurrency.currency_id},0,0)`);
    });
    const exchangeQuery = exchangeQueries.join(", ");
    const addExchangeRate = `INSERT INTO  exchange_rate (from_currency, to_currency,rate,available) VALUES ${exchangeQuery};`;
    await connection.query(addExchangeRate);
    res.json({ message: `Successfully added a new currency: ${name}(${abbreviation})` });
  } catch (err) {
    res.status(400).json({ error: err });
    console.log(err);
  } finally {
    connection.release();
  }
};

export const editCurrency = async (req, res, next) => {};
