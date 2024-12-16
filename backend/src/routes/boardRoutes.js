import express from 'express';
import { auth } from '../middleware/auth.js';
import Board from '../models/Board.js';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks for a board
router.get('/:boardId/tasks', auth, async (req, res) => {
  try {
    const { boardId } = req.params;
    
    // Verify board exists and user has access
    const board = await Board.findOne({
      _id: boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found or access denied' });
    }

    // Fetch all tasks for the board
    const tasks = await Task.find({ board: boardId })
      .populate('assignedTo', 'name email')
      .populate('dependencies.task', 'title status');

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching board tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task in a board
router.post('/:boardId/tasks', auth, async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, columnIndex, priority, dueDate, assignedTo } = req.body;

    // Verify board exists and user has access
    const board = await Board.findOne({
      _id: boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found or access denied' });
    }

    const task = new Task({
      title,
      description,
      board: boardId,
      columnIndex,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id
    });

    await task.save();

    // Populate necessary fields
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task in a board
router.patch('/:boardId/tasks/:taskId', auth, async (req, res) => {
  try {
    const { boardId, taskId } = req.params;
    const updates = req.body;

    // Verify board exists and user has access
    const board = await Board.findOne({
      _id: boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found or access denied' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, board: boardId },
      { $set: updates },
      { new: true }
    )
    .populate('assignedTo', 'name email')
    .populate('dependencies.task', 'title status');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task from a board
router.delete('/:boardId/tasks/:taskId', auth, async (req, res) => {
  try {
    const { boardId, taskId } = req.params;

    // Verify board exists and user has access
    const board = await Board.findOne({
      _id: boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found or access denied' });
    }

    const task = await Task.findOneAndDelete({ _id: taskId, board: boardId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Remove this task from any dependencies
    await Task.updateMany(
      { 'dependencies.task': taskId },
      { $pull: { dependencies: { task: taskId } } }
    );

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
