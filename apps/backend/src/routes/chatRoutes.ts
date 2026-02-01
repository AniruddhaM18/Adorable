import { Router } from "express";
import { agentChat } from "../controllers/chatController.js";


const chatRouter: Router = Router();

chatRouter.get("/chat", agentChat);

export default chatRouter;
