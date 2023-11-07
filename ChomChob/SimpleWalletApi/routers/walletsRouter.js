import express from "express";
import { adminAddMoney, walletTransaction } from "../controllers/walletController.js";
import { isAdmin, authentication } from "../utils/middlewares.js";
const walletsRouter = express.Router();

walletsRouter.post("/adminAdd", authentication, isAdmin, adminAddMoney);
walletsRouter.post("/transfer", walletTransaction);

export default walletsRouter;
