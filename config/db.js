const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connecté à MongoDB Atlas");
    } catch (err) {
        console.error("❌ Erreur MongoDB :", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;