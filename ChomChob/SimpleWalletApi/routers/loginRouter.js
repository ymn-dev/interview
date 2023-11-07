import express from "express";
const loginRouter = express.Router();
import { login } from "../controllers/loginController.js";

loginRouter.post("/", login);

export default loginRouter;
