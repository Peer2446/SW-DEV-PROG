import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  const mongoURI = process.env.MONGO_URI || "";
  const conn = await mongoose.connect(mongoURI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
