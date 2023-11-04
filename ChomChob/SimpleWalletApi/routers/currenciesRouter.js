import express from "express";
import { addCurrency, getAllCurrencies, editCurrency } from "../controllers/currencyController.js";

const currenciesRouter = express.Router();
currenciesRouter.post("/", addCurrency);
currenciesRouter.get("/", getAllCurrencies);
export default currenciesRouter;
