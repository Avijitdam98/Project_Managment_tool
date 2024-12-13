import express from 'express';
import { auth } from '../middleware/auth.js';
import { Task } from '../models/Task.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user._id })
      .populate('assignee', 'name email avatar')
      .populate('board', 'title');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    Object.assign(task, req.body);
    await task.save();
    
    res.json(task);
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
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.json(updatedTask);
  } catch (error) {
    console.error('Error moving task:', error);
    res.status(500).json({ error: 'Failed to move task', details: error.message });
  }
});

export default router;