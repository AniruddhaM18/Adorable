import "dotenv/config";
import {Sandbox} from "@e2b/code-interpreter";
import path from "path";
import { BASE_TEMPLATE } from "./baseTemplate.js";
import { dir } from "console";

//definig type for incoming file
type GeneratedFile = {
    path: string,
    content: string
}

export async function createSandbox(generatedFiles: GeneratedFile[]){
//we create a sandbox
const sbx = await Sandbox.create()
console.log(`Sandbox created ${sbx.sandboxId}`);

//merge logic(fixing the code not updating issue)
// We start with the Base Template, then overwrite/add the LLM's files
// const finalFileStructure = { ...BASE_TEMPLATE};

const finalFileStructure: Record<string, string> = { ...BASE_TEMPLATE };

generatedFiles.forEach(file => {
  if (file.path === "package.json") {
    console.warn("LLM attempted to overwrite package.json — ignored");
    return;
  }
  finalFileStructure[file.path] = file.content;
});

const uniqueDirs = new Set(
    Object.keys(finalFileStructure).map(p => path.dirname(p))
);

//create directories concurrently

const dirsToCreate = [...uniqueDirs].filter(d => d !== '.' && d !== '/');
if(dirsToCreate.length > 0) {
    await Promise.all(
        dirsToCreate.map(dir => sbx.commands.run(`mkdir -p ${dir}`))

    );
}

//write files, concurrent writing(its faster)
console.log("Writing files to sandbox");
//write files, concurrent writing(its faster)
console.log("Writing files to sandbox");
console.log("FILES TO WRITE:", Object.keys(finalFileStructure));

await Promise.all(
  Object.entries(finalFileStructure).map(([filePath, content]) => {
    console.log(`Writing ${filePath} (${content.length} chars)`);
    return sbx.files.write(filePath, content);
  })
);

// DEBUG HERE
const pkg = await sbx.files.read("package.json");
console.log("RAW PACKAGE.JSON ↓↓↓\n", pkg);

// npm install
console.log("installing dependancies");
await sbx.commands.run("npm install");


//starting the dev server in background
await sbx.commands.run("npm run dev", {background: true});

//get url
const port = 5173; 
    const host = sbx.getHost(port);
    const url = `https://${host}`;

    console.log(`App running at: ${url}`);

    return {
        sandboxId: sbx.sandboxId,
        url: url
    };
}

