import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in environment variables");
}

// Ensure global cache object exists
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

// Use the cached reference
let cached = global.mongoose;

export async function dbConnection() {
  // If already connected, return the connection
  if (cached.conn) {
    return cached.conn;
  }

  // If connection is being established, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    // Save the promise so concurrent calls reuse it
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
