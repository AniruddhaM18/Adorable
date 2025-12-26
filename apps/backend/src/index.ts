import express from "express";
import projectRouter from "./routes/projectRouter.js";
import { runUserRequest } from "./agent.js";
import { createSandbox } from "./sandbox.js";
import { assembleProject } from "./projectAssembler.js";

const app = express();
app.use(express.json());

app.use("/api/project", projectRouter);

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false });
    }

    //  LLM generates FILE DIFFS
    const result = await runUserRequest(prompt);

    // Assemble project IN MEMORY
    const project = assembleProject(result.files);

    // Create sandbox from assembled project
    const sandbox = await createSandbox(project);

    res.json({
      success: true,
      data: {
        previewUrl: sandbox.url,
        files: result.files
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(3000, () => {
    console.log("Server running @:3000")
})

