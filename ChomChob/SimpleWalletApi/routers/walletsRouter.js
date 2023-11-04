import express from "express";
import { adminAddMoney, walletTransaction } from "../controllers/walletController.js";
const walletsRouter = express.Router();

walletsRouter.post("/adminAdd", adminAddMoney);
walletsRouter.post("/transfer", walletTransaction);

export default walletsRouter;
