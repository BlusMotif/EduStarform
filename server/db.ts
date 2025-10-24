// Database integration with MongoDB using Mongoose
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://12sonjames:5l7bHtMCObabkycf@cluster0.fa8fd.mongodb.net/EDUSTARCONSULT_db?retryWrites=true&w=majority&appName=Cluster0';

if (!process.env.MONGO_URI) {
  console.warn('MONGO_URI not set, using default connection string');
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const db = mongoose.connection;
