// server.js
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";
import vehicleRoutes from "./routes/vehicles.js";

const app = express();

// Correction indispensable pour Vercel
app.set("trust proxy", 1);

// CORS propre et unique
app.use(cors({
  origin: "https://autodepenses-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Support des requêtes préflight
app.options("*", cors());

// Middlewares
app.use(express.json());

// Page d’accueil API
app.get("/", (req, res) => {
  res.json({ message: "API AutoDépenses opérationnelle" });
});

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Connexion MongoDB
connectDB();

// Routes
export default app;