import mongoose from "mongoose";
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();


export const connectDB = async () => {
  // Fix for DNS resolution issues with mongodb+srv on local Windows networks
  if (!process.env.VERCEL) {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  }
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("FATAL ERROR: MONGO_URI is not set in environment.");
    if (!process.env.VERCEL) process.exit(1);
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("DB connected");
  } catch (error) {
    console.log("DB connection failed", error);
    if (!process.env.VERCEL) process.exit(1);
  }
};