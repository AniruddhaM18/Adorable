import "dotenv/config";
import {Sandbox} from "@e2b/code-interpreter";
import path from "path";
import { BASE_TEMPLATE } from "./baseTemplate.js";


export async function createSndbox(){
    //we create a sandbox
const sbx = await Sandbox.create()
console.log(`Sandbox created ${sbx.sandboxId}`);

//Write the filesystem (Handling nested directories)
// We use a for...of loop to handle async/await properly

for(const [filePath, content] of Object.entries(BASE_TEMPLATE)) {
    const dir = path.dirname(filePath);

    //create a directory if its not at the root
    if(dir!== '.' && dir !=='/'){
        await sbx.commands.run(`mkdir -p ${dir}`);
    }
    //writing the files
    await sbx.files.write(filePath, content);
    console.log(`written: ${filePath}`)
}

//installing dependancies
console.log("installing dependancies");
await sbx.commands.run("npm install");

//start the dev server in the background
console.log("starting dev server in background");
// 'background: true' is CRITICAL for servers, otherwise code hangs here
const cmd = await sbx.commands.run("npm run dev", {background: true});

//Expose the port (Lovable-style)
// Assuming your Vite/Next.js app runs on port 5173 or 3000. 
// You can force a specific port in your package.json scripts (e.g., "vite --port 3000")
const port = 5173 
const url = sbx.getHost(port);

console.log(`\nYour app is running. Access it here:\nhttps://${url}`);

// Keep the process alive so the sandbox doesn't die immediately
// (or rely on your Express server to keep the node process running)
return {
    sandboxId: sbx.sandboxId,
    url: `https://${url}`
}

}

