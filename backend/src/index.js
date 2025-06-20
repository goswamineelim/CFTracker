import express from "express"
import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import linkRoute from "./routes/link.routes.js"
import { connectDB } from "./lib/Db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import './lib/google.js';
import passport from 'passport';

const app = express();

dotenv.config();
app.get("/", (req, res) => {
  res.send({ "message": "Welcome to server" });
});

app.use(express.json());

app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/link", linkRoute)


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  connectDB();
})