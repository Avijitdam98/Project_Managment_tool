// FILE: config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

// 🌐 Load environment variables
dotenv.config();

// 🔥 MongoDB connection function
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    console.log(
      colors.cyan(
        `🔄 [${new Date().toLocaleTimeString()}] Attempting to connect to MongoDB...`
      )
    );

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      colors.bgGreen.black(
        `🚀 [${new Date().toLocaleTimeString()}] MongoDB Connected: ${conn.connection.host}`
      )
    );

    // Enable debug mode for Mongoose
    mongoose.set('debug', process.env.NODE_ENV === 'development');

    return conn;
  } catch (error) {
    console.error(
      colors.bgRed.white(
        `❌ [${new Date().toLocaleTimeString()}] Connection Failed: ${error.message}`
      )
    );
    
    // Log more details about the error
    if (error.name === 'MongoServerError') {
      console.error(colors.red('MongoDB Server Error:'), error);
    } else if (error.name === 'MongooseError') {
      console.error(colors.red('Mongoose Error:'), error);
    } else {
      console.error(colors.red('Unknown Error:'), error);
    }
    
    process.exit(1); // Exit on failure
  }
};

// 💡 Mongoose events for better observability
mongoose.connection.on("connected", () =>
  console.log(colors.cyan("✨ Database Sync: Connection Established"))
);

mongoose.connection.on("error", (err) => {
  console.error(colors.red(`⚠️ Database Alert: ${err.message}`));
  console.error(colors.red('Error Details:'), err);
});

mongoose.connection.on("disconnected", () =>
  console.log(colors.yellow("🔄 Database Sync: Disconnected"))
);

// 🛑 Graceful shutdown for modern app termination (Async cleanup)
const gracefulExit = async () => {
  console.log(colors.magenta(`👋 [${new Date().toLocaleTimeString()}] Shutting down...`));
  try {
    await mongoose.connection.close();
    console.log(
      colors.magenta(`✅ [${new Date().toLocaleTimeString()}] Connection Closed Gracefully`)
    );
    process.exit(0);
  } catch (err) {
    console.error(
      colors.red(`❌ [${new Date().toLocaleTimeString()}] Error during shutdown: ${err.message}`)
    );
    process.exit(1);
  }
};

// 🔗 Capture app signals for enhanced DX
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, gracefulExit)
);

export default connectDB;
