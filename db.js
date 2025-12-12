import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();


export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("FATAL ERROR: MONGO_URI is not set in environment.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("DB connected");
  } catch (error) {
    console.log("DB connection failed", error);
    process.exit(1);
  }
};