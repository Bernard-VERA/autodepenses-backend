// Force Node à utiliser un DNS compatible avec MongoDB Atlas.a supprimer pour la mise en prod
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicles");
const expenseRoutes = require("./routes/expenses");

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/expenses", expenseRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// Démarrage
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Serveur backend sur http://localhost:${PORT}`);
    });
});