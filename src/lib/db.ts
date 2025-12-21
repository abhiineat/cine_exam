import mongoose from "mongoose";

let isConnected = false;

export async function connectToDB() {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const DB_URI = process.env.DB_URI;

  if (!DB_URI) {
    console.error("❌ DB_URI is missing at runtime");
    throw new Error("DB_URI environment variable is not defined");
  }

  try {
    await mongoose.connect(DB_URI, {
      bufferCommands: false,
    });

    isConnected = true;
    console.log("✅ Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw error;
  }
}
