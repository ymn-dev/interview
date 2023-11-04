import express from "express";
import { getExchangeRates, addExchangeRate, modifyExchangeRate, deleteExchangeRate } from "../controllers/exchangeController.js";
const exchangeRouter = express.Router();

exchangeRouter.get("/", getExchangeRates);

exchangeRouter.post("/", addExchangeRate);

exchangeRouter.patch("/", modifyExchangeRate);

exchangeRouter.delete("/", deleteExchangeRate);

export default exchangeRouter;
