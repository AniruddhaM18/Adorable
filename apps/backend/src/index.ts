import express from "express";
import projectRouter from "./routes/projectRouter.js";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";


const app = express();
app.use(cookieParser());     
app.use(express.json());

app.use("/project", projectRouter);

app.use("/auth", authRouter);

app.post("/amrit", async(req, res) => {

});

app.listen(3000, () => {
    console.log("Server running @:3000")
})

