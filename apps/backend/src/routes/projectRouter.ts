import { Router } from "express";
import { createProject, getProject } from "../controllers/projectController.js";
import { deployProject } from "../controllers/deployController.js";
import { authMiddleware } from "../middleware/middleware.js";

const projectRouter: Router = Router();

projectRouter.post("/create", authMiddleware, createProject);
projectRouter.get("/:projectId", authMiddleware, getProject);
projectRouter.post("/:projectId/deploy", authMiddleware, deployProject);

export default projectRouter;