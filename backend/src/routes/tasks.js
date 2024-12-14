import express from 'express';
import { auth } from '../middleware/auth.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user._id })
      .populate('assignee', 'name email avatar status')
      .populate('board', 'title');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.patch('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    Object.assign(task, req.body);
    await task.save();
    
    const updatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email avatar status')
      .populate('board', 'title');
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Assign task to user
router.post('/:taskId/assign', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    task.assignee = userId;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email avatar status')
      .populate('board', 'title');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Move task endpoint
router.post('/move', auth, async (req, res) => {
  try {
    const { boardId, taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = req.body;

    // Find the task and verify it exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update task's column reference and status
    task.column = destinationColumnId;
    await task.save();

    // Return the updated task with populated fields
    const updatedTask = await Task.findById(taskId)
      .populate('assignee', 'name email avatar status')
      .populate('board', 'title');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;