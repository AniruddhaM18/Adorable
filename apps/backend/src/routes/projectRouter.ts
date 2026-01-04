import { Router } from "express";
import { createProject, getProject } from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/middleware.js";

const projectRouter: Router = Router();

projectRouter.post("/create", authMiddleware, createProject);
projectRouter.get("/:projectId", authMiddleware, getProject);

export default projectRouter;