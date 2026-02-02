import { Request, Response } from "express";
import { prisma } from "@repo/database";
import { Sandbox } from "@e2b/code-interpreter";
import { deployToCloudflareViaSandbox } from "../cloudflare.js";

export async function deployProject(req: Request, res: Response) {
    const { projectId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch project
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
    });

    if (!project) {
        return res.status(404).json({ error: "Project not found" });
    }

    try {
        // Extract sandboxId from preview URL
        const urlMatch = project.previewUrl.match(/https:\/\/\d+-([^.]+)\.e2b\.app/);

        if (!urlMatch) {
            return res.status(400).json({ error: "Invalid sandbox URL" });
        }

        const sandboxId = urlMatch[1];
        console.log(`Deploying project from sandbox: ${sandboxId}`);

        // Connect to sandbox
        const sbx = await Sandbox.connect(sandboxId);

        // Deploy using wrangler in sandbox
        const result = await deployToCloudflareViaSandbox(sbx, project.name);

        if (!result.success) {
            return res.status(500).json({
                error: "Deployment failed",
                details: result.error
            });
        }

        // Save deployed URL to database
        await prisma.project.update({
            where: { id: projectId },
            data: { deployedUrl: result.url },
        });

        console.log(`Project deployed: ${result.url}`);

        return res.json({
            success: true,
            url: result.url,
        });

    } catch (error: any) {
        console.error("Deploy error:", error);
        return res.status(500).json({
            error: "Deployment failed",
            details: error.message
        });
    }
}
