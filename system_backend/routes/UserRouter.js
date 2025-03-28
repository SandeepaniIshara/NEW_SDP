import { registerClerk,getClerks,deleteClerk,loginClerk } from "../controllers/userController.js";

import authMiddleware from "../middleware/auth.js";
import express from "express";
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const userRouter = express.Router();

userRouter.post("/register", registerClerk);
userRouter.post("/login", loginClerk);
userRouter.post("/delete", authMiddleware, deleteClerk);
userRouter.get("/get_users", getClerks);

export default userRouter;
