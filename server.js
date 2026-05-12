import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";
import vehicleRoutes from "./routes/vehicles.js";

const app = express();

app.set("trust proxy", 1);

// CORS global — gère automatiquement OPTIONS
app.use(cors({
  origin: "https://autodepenses-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API AutoDépenses opérationnelle" });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/vehicles", vehicleRoutes);

export default app;
