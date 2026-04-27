import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "../config/db.js";
import authRoutes from "../routes/auth.js";
import expenseRoutes from "../routes/expenses.js";
import vehicleRoutes from "../routes/vehicles.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Connexion MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);
app.use("/vehicles", vehicleRoutes);

// Export pour Vercel
export default (req, res) => app(req, res);

