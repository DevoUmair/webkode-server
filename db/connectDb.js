import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGOOSE_ID}`);
    console.log(`\n MongoDB connected !! `);
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};
