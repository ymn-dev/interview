import express from "express";
import { deleteCurrency, addCurrency, getAllCurrencies, editCurrency } from "../controllers/currencyController.js";
import { isAdmin, authentication } from "../utils/middlewares.js";

const currenciesRouter = express.Router();
currenciesRouter.post("/", authentication, isAdmin, addCurrency);
currenciesRouter.get("/", getAllCurrencies);
currenciesRouter.post("/edit", authentication, isAdmin, editCurrency);
currenciesRouter.delete("/", authentication, isAdmin, deleteCurrency);
export default currenciesRouter;
