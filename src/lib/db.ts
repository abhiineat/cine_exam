import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URI!;

if (!MONGODB_URI) {
  throw new Error("DB_URI is missing");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  console.log("🧠 readyState:", mongoose.connection.readyState);
  console.log("🧠 db name:", mongoose.connection.db?.databaseName);
  console.log("🧠 host:", mongoose.connection.host);
  console.log("🟢 MongoDB connected");
  return cached.conn;
}
