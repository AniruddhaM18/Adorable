import { prisma, Prisma } from "@repo/database";
import { Request, Response } from "express";
import { runUserRequest } from "../agent.js";
import { assembleProject } from "../projectAssembler.js";
import { createSandbox } from "../sandbox.js";
import { success } from "zod";

export async function createProject(req: Request, res: Response) {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({
            success: false,
            message: "Prompt not found"
        })
    }

    let sandbox: { id: string, url: string } | null = null;

    try {

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        //generate code
        const result = await runUserRequest(prompt);
        const projectFiles = await assembleProject(result.files);

        //db transaction
        const { project, version } = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            //create project
            const project = await tx.project.create({
                data: {
                    userId: userId,
                    name: "Untitled Project",
                    previewUrl: "", // temporary empty,
                    currentVersionId: "",
                    staus: "creating"
                }
            });

            //create version
            const version = await tx.version.create({
                data: {
                    projectId: project.id,
                    files: projectFiles,
                    prompt
                }
            });
            return { project, version }
        });

        //create sandbox after db entries
        const sandbox = await createSandbox(projectFiles);

        //attach preview url
        await prisma.project.update({
            where:{
                id: project.id
            },
            data: {
                name: result.projectName ?? project.name,
                previewUrl: sandbox.url,
                currentVersionId: sandbox.url,
                staus: "ready"
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            messaage: "Server error"
        })
    }
}