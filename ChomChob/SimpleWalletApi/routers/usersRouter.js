import express from "express";
import { getAllUsers, addUser } from "../controllers/userController.js";
import { isAdmin, authentication } from "../utils/middlewares.js";

const usersRouter = express.Router();

usersRouter.get("/", authentication, isAdmin, getAllUsers);

usersRouter.post("/", addUser);

export default usersRouter;
