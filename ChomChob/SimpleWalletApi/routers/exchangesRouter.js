import express from "express";
import { getExchangeRates } from "../controllers/exchangeController.js";
const exchangeRouter = express.Router();

exchangeRouter.get("/", getExchangeRates);

export default exchangeRouter;
