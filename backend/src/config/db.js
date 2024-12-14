// FILE: config/db.js
import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      colors.cyan.bold(`
      ✨ MongoDB Connection Successful! ✨
      Host: ${conn.connection.host} 
      `)
    );
  } catch (error) {
    console.error(colors.red.bold.inverse(`
       🚨 MongoDB Connection Error! 🚨
       ${error.message}
       `)
    );
    process.exit(1);
  }
};

export default connectDB;