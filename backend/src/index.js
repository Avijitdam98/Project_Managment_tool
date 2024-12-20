import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { initSocket } from './services/socket.js';
import authRoutes from './routes/auth.js';
import boardRoutes from './routes/boards.js';
import taskRoutes from './routes/tasks.js';
import notificationRoutes from './routes/notifications.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projectRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import analyticsRoutes from './routes/analytics.js';
import colors from 'colors';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', analyticsRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(
    colors.bgMagenta.white(
      `🌟 [${new Date().toLocaleTimeString()}] Server running on port ${PORT} 🚀`
    )
  );
});
