import express from "express";
import { getAllUsers, addUser } from "../controllers/userController.js";

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);

usersRouter.post("/", addUser);

export default usersRouter;
