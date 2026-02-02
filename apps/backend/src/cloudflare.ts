import "dotenv/config";
import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN } from "./config.js";
import { Sandbox } from "@e2b/code-interpreter";
import path from "path";



type DeployResult = {
    success: boolean;
    url?: string;
    error?: string;
};

/**
 * Deploy files to Cloudflare Pages using Wrangler CLI in the sandbox
 * 
 * This approach:
 * 1. Writes the Cloudflare credentials temporarily
 * 2. Builds the project
 * 3. Uses `wrangler pages deploy` to upload
 * 4. Returns the deployed URL
 */

export async function deployToCloudflareViaSandbox(
    sbx: Sandbox,
    projectName: string
): Promise<DeployResult> {
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
        return {
            success: false,
            error: "Cloudflare credentials not configured"
        };
    }

    const safeName = projectName
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 58);

    console.log(`Deploying to Cloudflare Pages: ${safeName}`);

    try {
        // Build the project
        console.log("Building project...");
        const buildResult = await sbx.commands.run("npm run build 2>&1", {
            timeoutMs: 60000,
        });

        if (buildResult.exitCode !== 0) {
            console.error("Build failed:", buildResult.stdout);
            return {
                success: false,
                error: `Build failed: ${buildResult.stdout}`,
            };
        }

        console.log("Build successful, deploying with wrangler...");

        // Install wrangler and deploy using environment variables
        const deployCmd = `CLOUDFLARE_ACCOUNT_ID=${CLOUDFLARE_ACCOUNT_ID} CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN} npx wrangler pages deploy dist --project-name=${safeName} 2>&1`;

        const deployResult = await sbx.commands.run(deployCmd, {
            timeoutMs: 120000, // 2 minutes for deploy
        });

        console.log("Deploy output:", deployResult.stdout);

        if (deployResult.exitCode !== 0) {
            console.error("Deploy failed:", deployResult.stdout);
            return {
                success: false,
                error: `Deploy failed: ${deployResult.stdout}`,
            };
        }

        // Parse the URL from wrangler output
        // Wrangler outputs something like: " Deployment complete! Take a peek over at https://xxxxx.project-name.pages.dev"
        const urlMatch = deployResult.stdout.match(/https:\/\/[^\s]+\.pages\.dev/);
        const deployedUrl = urlMatch
            ? urlMatch[0]
            : `https://${safeName}.pages.dev`;

        console.log(`Deployment successful: ${deployedUrl}`);

        return {
            success: true,
            url: deployedUrl,
        };
    } catch (error: any) {
        console.error("Cloudflare deployment error:", error);
        return {
            success: false,
            error: error.message || "Deployment failed",
        };
    }
}
