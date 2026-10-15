
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        dbName: process.env.DB_NAME || "lifesync",
      }
    );

    console.log(
      `MongoDB connected: ${connection.connection.name}`
    );
  } catch (error) {
    console.error(
      `MongoDB connection error: ${error.message}`
    );
    throw error;
  }
};

export default connectDB;
