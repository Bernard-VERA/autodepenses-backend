import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connecté :", conn.connection.host);
  } catch (error) {
    console.error("Erreur MongoDB :", error);
    throw error;
  }
};

export default connectDB;
