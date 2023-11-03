import express from "express";
import { getExchangeRates, addExchangeRate } from "../controllers/exchangeController.js";
const exchangeRouter = express.Router();

exchangeRouter.get("/", getExchangeRates);

exchangeRouter.post("/", addExchangeRate);

export default exchangeRouter;
