import { Router } from "express";
import { createProject } from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/middleware.js";

const projectRouter: Router = Router();

projectRouter.post("/create", authMiddleware, createProject);

export default projectRouter;