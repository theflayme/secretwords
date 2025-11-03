import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 5000;
const MONGO_URI = "mongodb://mongo:27017/myapp";

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Fixed: () instead of backticks
  })
  .catch((err) => console.error("DB connection error:", err));