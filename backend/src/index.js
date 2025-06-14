import express from "express"
import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import { connectDB } from "./lib/Db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
app.get("/", (req, res)=>{
    res.send({"message" : "Welcome to server"});
});

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`);
    connectDB();
})