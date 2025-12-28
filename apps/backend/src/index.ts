import express from "express";
import projectRouter from "./routes/projectRouter.js";
import authRouter from "./routes/authRouter.js";
import { prisma } from "@repo/database";

prisma.user.findMany().then(users => {
    console.log("Users:", users);
})

const app = express();
app.use(express.json());

// app.use("/project", projectRouter);

// app.use("/auth", authRouter);

app.listen(3000, () => {
    console.log("Server running @:3000")
})

