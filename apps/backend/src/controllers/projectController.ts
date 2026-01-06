import { prisma, Prisma } from "@repo/database";
import { Request, Response } from "express";
import { runUserRequest } from "../agent.js";
import { assembleProject } from "../projectAssembler.js";
import { createSandbox } from "../sandbox.js";

export async function createProject(req: Request, res: Response) {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      success: false,
      message: "Prompt not found",
    });
  }

  console.log("prompt recived");

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {

    const result = await runUserRequest(prompt);

    if (!result.success) {
      return res.status(200).json({
        success: false,
        message: result.error ?? "AI generation failed",
      });
    }

    if (!Array.isArray(result.files) || result.files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "AI did not generate any files",
      });
    }

    ///assembling files
    const projectFiles = await assembleProject(result.files);

    const { project, version } = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const project = await tx.project.create({
          data: {
            userId,
            name: result.projectName ?? "Untitled Project",
            previewUrl: "",
            currentVersionId: "",
            staus: "creating", // keeping schema spelling
          },
        });

        const version = await tx.version.create({
          data: {
            projectId: project.id,
            files: projectFiles,
            prompt,
          },
        });

        return { project, version };
      }
    );

//sandbox

    let sandbox;
    try {
      sandbox = await createSandbox(projectFiles);
    } catch (err) {
      await prisma.project.update({
        where: { id: project.id },
        data: { staus: "failed" },
      });

      return res.status(500).json({
        success: false,
        message: "Sandbox creation failed",
      });
    }

//finalize project

    await prisma.project.update({
      where: { id: project.id },
      data: {
        previewUrl: sandbox.url,
        currentVersionId: version.id,
        staus: "ready",
      },
     });

    return res.status(201).json({
      success: true,
      projectId: project.id,
      previewUrl: sandbox.url,
    });
  } catch (err) {
    console.error("Create project failed:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

//get 

export async function getProject(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        version: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const currentVersion = project.version.find(
      (v) => v.id === project.currentVersionId
    );

    if (!currentVersion) {
      return res.status(500).json({
        success: false,
        message: "Current version not found",
      });
    }

    return res.status(200).json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        status: project.staus,
        previewUrl: project.previewUrl,
        currentVersion,
      },
    });
  } catch (err) {
    console.error("Get project failed:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
