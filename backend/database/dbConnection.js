import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const mongoUri =
      process.env.DB_URL || "mongodb://127.0.0.1:27017/SIP";
    await mongoose.connect(mongoUri);

    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error(
      "MongoDB Connection Failed:",
      error.message
    );

    process.exit(1);
  }
};

export default dbConnection;
