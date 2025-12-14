import express from "express";
import projectRouter from "./routes/projectRouter.js";
import { createSndbox } from "./sandbox.js";

const app = express();
app.use(express.json());

app.use("/api/project", projectRouter);

app.post("/create/sandbox", async(req, res) => {
    try{
        const sandbox = await createSndbox();
        res.status(201).json({
            success: true,
            sandbox
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "failed to create sandbox"
        })
    }
})

app.listen(3000, () => {
    console.log("Server running @:3000")
})

