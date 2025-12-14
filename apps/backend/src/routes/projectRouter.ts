import { Router } from "express";
import { createProject } from "../controllers/projectController.js";

const projectRouter: Router = Router();


projectRouter.post("/create", createProject);

export default projectRouter;