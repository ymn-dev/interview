import express from "express";
import { seeExchangeRate } from "../controllers/exchangeController.js";
const exchangeRouter = express.Router();

exchangeRouter.get("/", seeExchangeRate);

export default exchangeRouter;
