import express from "express";
import { adminAddToWallet } from "../controllers/walletController.js";
const walletsRouter = express.Router();

walletsRouter.post("/adminAdd", adminAddToWallet);

export default walletsRouter;
