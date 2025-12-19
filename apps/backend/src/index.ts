import express from "express";
import projectRouter from "./routes/projectRouter.js";
import { runUserRequest } from "./agent.js";

const app = express();
app.use(express.json());

app.use("/api/project", projectRouter);


app.post("/api/generate", async(req, res)=> {
    try {
        const { prompt } = req.body;

        if(!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is reqd."
            })
        };

        console.log("Prompt recived");
        // Call the LangGraph Agent
        // This will:
        // 1. Talk to LLM
        // 2. Generate Files
        // 3. Create Sandbox (E2B)
        // 4. Return the Preview URL
        const result = await runUserRequest(prompt);
        res.json({
            success:true,
            data: {
                previewUrl: result.previewUrl,
                files: result.files
            }
        });
    }catch(err: any){
        console.error(err);
        res.status(500).json({
            success: false,
            message: "failed to generate website",
        });
    }
})

app.listen(3000, () => {
    console.log("Server running @:3000")
})

