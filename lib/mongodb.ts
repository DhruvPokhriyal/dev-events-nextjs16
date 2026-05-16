import "server-only"
import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

type MongooseConnectionCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

type GlobalWithMongoose = typeof globalThis & {
  _mongoose?: MongooseConnectionCache
}

const globalForMongoose = globalThis as GlobalWithMongoose

// Reuse the cached connection during hot-reloads in development to prevent
// opening many connections to MongoDB.
const cached: MongooseConnectionCache = globalForMongoose._mongoose ?? {
  conn: null,
  promise: null,
}

globalForMongoose._mongoose = cached

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return an existing connection when available.
  if (cached.conn) {
    return cached.conn
  }

  // Create and cache the initial connection promise once.
  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, options)
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    // Reset the promise so future calls can retry after a failure.
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectToDatabase
