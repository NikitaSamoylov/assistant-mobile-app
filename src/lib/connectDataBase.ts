import mongoose from 'mongoose';

const URI = process.env.URI as string;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(URI);
};