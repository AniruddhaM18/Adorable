import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/database";
import { runEditAgentStream } from "../editAgent.js";
import { updateSandboxFiles } from "../sandbox.js";
import { FileChange } from "../modifyTools.js";

/* Helper to convert nested files object to flat Record<string, string> */

function flattenFiles(
    files: any,
    prefix: string = ""
): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(files)) {
        const path = prefix ? `${prefix}/${key}` : key;

        if (typeof value === "string") {
            // It's file content
            result[path] = value;
        } else if (value && typeof value === "object") {
            if ("content" in value && typeof (value as any).content === "string") {
                // It's a file object with content property
                result[path] = (value as any).content;
            } else {
                // It's a directory, recurse
                Object.assign(result, flattenFiles(value, path));
            }
        }
    }

    return result;
}

/* Helper to apply file changes to existing files */

function applyFileChanges(
    currentFiles: Record<string, string>,
    changes: FileChange[]
): Record<string, string> {
    const newFiles = { ...currentFiles };

    for (const change of changes) {
        if (change.action === "delete") {
            delete newFiles[change.path];
        } else {
            // create or modify
            newFiles[change.path] = change.content;
        }
    }

    return newFiles;
}

/* Helper to convert flat files back to nested structure */

function unflattenFiles(flatFiles: Record<string, string>): any {
    const result: any = {};

    for (const [path, content] of Object.entries(flatFiles)) {
        const parts = path.split("/");
        let current = result;

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        }

        const fileName = parts[parts.length - 1];
        current[fileName] = { content };
    }

    return result;
}

/* Edit project via chat */

export async function editProjectChat(req: Request, res: Response) {
    const { projectId } = req.params;
    const userId = req.user?.id;

    // Parse payload
    let payload: any;
    try {
        if (typeof req.query.payload !== "string") {
            return res.status(400).json({ error: "Missing payload" });
        }
        payload = JSON.parse(req.query.payload);
    } catch (err) {
        console.error("Invalid payload", err);
        return res.status(400).json({ error: "Invalid payload" });
    }

    const messages = payload?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "No messages provided" });
    }

    // Auth check
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch project
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
        include: { version: true },
    });

    if (!project) {
        return res.status(404).json({ error: "Project not found" });
    }

    const currentVersion = project.version.find(
        (v) => v.id === project.currentVersionId
    );

    if (!currentVersion) {
        return res.status(500).json({ error: "Current version not found" });
    }

    // Flatten current files for the prompt
    const currentFiles = flattenFiles(currentVersion.files);

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    res.write(": connected\n\n");

    try {
        // Get the latest user message
        const latestMessage = messages[messages.length - 1];
        const chatHistory = messages.slice(0, -1);

        // Run the edit agent
        const fileChanges = await runEditAgentStream(
            currentFiles,
            latestMessage.content,
            chatHistory,
            (event) => {
                res.write(`data: ${JSON.stringify(event)}\n\n`);
            }
        );

        console.log(`Edit agent returned ${fileChanges.length} file changes:`, fileChanges.map(f => f.path));

        // If we have file changes, save them
        if (fileChanges.length > 0) {
            const updatedFiles = applyFileChanges(currentFiles, fileChanges);

            // Create new version - store flat format to match initial project creation
            const newVersion = await prisma.version.create({
                data: {
                    projectId: project.id,
                    files: updatedFiles,  // Store flat format for consistency
                    prompt: latestMessage.content,
                },
            });

            // Update project to point to new version
            await prisma.project.update({
                where: { id: project.id },
                data: { currentVersionId: newVersion.id },
            });

            // Try to update the sandbox with new files
            try {
                // Extract sandboxId from preview URL
                // URL format: https://5173-{sandboxId}.e2b.app
                const urlMatch = project.previewUrl.match(/https:\/\/\d+-([^.]+)\.e2b\.app/);
                if (urlMatch) {
                    const sandboxId = urlMatch[1];
                    console.log(`Updating sandbox: ${sandboxId}`);
                    await updateSandboxFiles(sandboxId, updatedFiles);
                }
            } catch (sandboxErr) {
                console.error("Failed to update sandbox:", sandboxErr);
                // Don't fail the request, the files are saved
            }

            // Notify frontend about the completed update
            // Send flat files to match the format from initial project load
            console.log(`Sending version_created event with ${Object.keys(updatedFiles).length} files`);
            res.write(
                `data: ${JSON.stringify({
                    type: "version_created",
                    versionId: newVersion.id,
                    files: updatedFiles,  // Send flat format, not nested
                })}\n\n`
            );
        }
    } catch (err) {
        console.error("Edit agent error:", err);
        res.write(
            `data: ${JSON.stringify({
                type: "error",
                message: "Failed to process edit request",
            })}\n\n`
        );
    } finally {
        res.end();
    }
}
