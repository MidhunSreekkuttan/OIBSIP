import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri) {
      console.log(`[DB] Attempting connection to MongoDB at: ${uri}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('✅ [DB] Successfully connected to MongoDB');
      return;
    }
  } catch (err) {
    console.warn(`⚠️ [DB] Could not connect to external MongoDB: ${err.message}`);
    console.log('🔄 [DB] Falling back to embedded MongoMemoryServer for instant local execution...');
  }

  try {
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✅ [DB] Successfully connected to Embedded MongoMemoryServer at: ${memoryUri}`);
  } catch (memErr) {
    console.error('❌ [DB] Failed to initialize embedded MongoDB:', memErr.message);
    throw memErr;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('[DB] Disconnected from database');
  } catch (error) {
    console.error('[DB] Error during disconnection:', error);
  }
};

