import express from "express";
import {
  createMail,
  getMails,
  getMailDetails,
  updateMailStatus,
  deleteMail,
} from "../controllers/mailController.js";
import authMiddleware from "../middleware/auth.js";

const mailRouter = express.Router();

// Route to create a new mail
mailRouter.post("/create", authMiddleware, createMail);

// Route to get all mails
mailRouter.get("/get_mails", getMails);

// Route to get details of a specific mail
mailRouter.get("/details/:id", authMiddleware, getMailDetails);

// Route to update the status of a mail
mailRouter.put("/update_status/:id", authMiddleware, updateMailStatus);

// Route to delete a mail
mailRouter.delete("/delete/:id", authMiddleware, deleteMail);

export default mailRouter;