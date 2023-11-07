import express from "express";
import { getExchangeRates, addExchangeRate, modifyExchangeRate, deleteExchangeRate } from "../controllers/exchangeController.js";
import { isAdmin, authentication } from "../utils/middlewares.js";
const exchangeRouter = express.Router();

exchangeRouter.get("/", getExchangeRates);

exchangeRouter.post("/", authentication, isAdmin, addExchangeRate);

exchangeRouter.patch("/", authentication, isAdmin, modifyExchangeRate);

exchangeRouter.delete("/", authentication, isAdmin, deleteExchangeRate);

export default exchangeRouter;
