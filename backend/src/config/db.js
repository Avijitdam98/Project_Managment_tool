// FILE: config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

// 🌐 Load environment variables
dotenv.config();

// 🔥 MongoDB connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      colors.bgGreen.black(
        `🚀 [${new Date().toLocaleTimeString()}] MongoDB Connected: ${conn.connection.host}`
      )
    );
  } catch (error) {
    console.error(
      colors.bgRed.white(
        `❌ [${new Date().toLocaleTimeString()}] Connection Failed: ${error.message}`
      )
    );
    process.exit(1); // Exit on failure
  }
};

// 💡 Mongoose events for better observability
mongoose.connection.on("connected", () =>
  console.log(colors.cyan("✨ Database Sync: Connection Established"))
);

mongoose.connection.on("error", (err) =>
  console.error(colors.red(`⚠️ Database Alert: ${err}`))
);

mongoose.connection.on("disconnected", () =>
  console.log(colors.yellow("🔄 Database Sync: Disconnected"))
);

// 🛑 Graceful shutdown for modern app termination (Async cleanup)
const gracefulExit = async () => {
  console.log(colors.magenta(`👋 [${new Date().toLocaleTimeString()}] Shutting down...`));
  await mongoose.connection.close(() => {
    console.log(
      colors.magenta(`✅ [${new Date().toLocaleTimeString()}] Connection Closed Gracefully`)
    );
    process.exit(0);
  });
};

// 🔗 Capture app signals for enhanced DX
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, gracefulExit)
);

// 🌟 Export the connection function
export default connectDB;
