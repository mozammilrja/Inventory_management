import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  // Return mock connection during build (when window is undefined in production)
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    if (!cached.promise) {
      cached.promise = Promise.resolve({ readyState: 0 });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  cached.conn = await cached.promise;
  (global as any).mongoose = cached;

  return cached.conn;
}
