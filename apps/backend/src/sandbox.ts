import "dotenv/config";
import { Sandbox } from "@e2b/code-interpreter";
import path from "path";

/**
 * Final assembled project:
 * key   = file path (e.g. src/App.jsx)
 * value = full file content
 */
export type ProjectFiles = Record<string, string>;

export async function createSandbox(project: ProjectFiles) {
  // Create sandbox
  const sbx = await Sandbox.create();
  console.log(`Sandbox created: ${sbx.sandboxId}`);

  /**
   * Create directory structure
   * We extract all parent directories from file paths
   */
  const uniqueDirs = new Set(
    Object.keys(project).map((filePath) => path.dirname(filePath))
  );

  const dirsToCreate = [...uniqueDirs].filter(
    (dir) => dir !== "." && dir !== "/"
  );

  if (dirsToCreate.length > 0) {
    await Promise.all(
      dirsToCreate.map((dir) =>
        sbx.commands.run(`mkdir -p ${dir}`)
      )
    );
  }

  /**
     Write files to sandbox
   */
  console.log("Writing project files to sandbox...");
  await Promise.all(
    Object.entries(project).map(([filePath, content]) => {
      console.log(`→ ${filePath} (${content.length} chars)`);
      return sbx.files.write(filePath, content);
    })
  );

  /**
   Install dependencies
   */
  console.log("Installing dependencies...");
  await sbx.commands.run("npm install");

  /**
    Start dev server (background)
   */
  console.log("Starting dev server...");
  await sbx.commands.run("npm run dev", { background: true });

  /**
   Generate preview URL
   */
  const port = 5173;
  const host = sbx.getHost(port);
  const url = `https://${host}`;

  console.log(`Preview running at: ${url}`);

  return {
    sandboxId: sbx.sandboxId,
    url,
  };
};