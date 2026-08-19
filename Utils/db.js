import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config({ quiet: true });

// Attempt setting DNS servers safely (supported in local node, ignored gracefully in serverless)
try {
    dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // Ignore in restricted serverless environments
}

let cachedPromise = global.mongooseCachePromise || null;

export const connectDB = async () => {
    const DB = process.env.DATABASE;

    if (!DB) {
        console.error("CRITICAL ERROR: DATABASE URI is not defined in process.env!");
        throw new Error("DATABASE URI is missing from environment variables.");
    }

    // 1. If connection is already open, return it immediately
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // 2. If a connection attempt is in progress, await it
    if (cachedPromise) {
        await cachedPromise;
        return mongoose.connection;
    }

    // 3. Initiate new connection with optimal Vercel serverless settings
    console.log("Connecting to MongoDB Atlas...");
    
    cachedPromise = mongoose.connect(DB, {
        bufferCommands: false, // Prevents 10,000ms buffering timeouts on serverless cold starts
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
    }).then((m) => {
        console.log("Successfully connected to MongoDB Atlas!");
        return m;
    }).catch((err) => {
        cachedPromise = null;
        global.mongooseCachePromise = null;
        console.error("MongoDB Connection Failed:", err.message);
        throw err;
    });

    global.mongooseCachePromise = cachedPromise;
    await cachedPromise;
    return mongoose.connection;
};

export default connectDB;
