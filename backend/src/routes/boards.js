import express from 'express';
import { auth } from '../middleware/auth.js';
import { Board } from '../models/Board.js';
import { emitBoardUpdate } from '../services/socket.js';

const router = express.Router();

// Create a new board
router.post('/', auth, async (req, res) => {
  try {
    const board = new Board({
      ...req.body,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
      columns: [
        { title: 'To Do', order: 0, tasks: [] },
        { title: 'In Progress', order: 1, tasks: [] },
        { title: 'Done', order: 2, tasks: [] }
      ]
    });
    
    await board.save();
    
    // Emit board creation event
    emitBoardUpdate(board._id, 'board-created', board);
    
    res.status(201).json(board);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// Get all boards for current user
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({
      'members.user': req.user._id,
      isArchived: false
    })
    .populate('members.user', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort('-updatedAt');
    
    res.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// Get a specific board
router.get('/:boardId', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id,
      isArchived: false
    })
    .populate('members.user', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate({
      path: 'columns.tasks',
      populate: [
        { path: 'assignee', select: 'name email avatar' },
        { path: 'createdBy', select: 'name email avatar' },
        { path: 'comments.user', select: 'name email avatar' }
      ]
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

// Add a new column
router.post('/:boardId/columns', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    await board.addColumn(req.body);
    
    // Emit board update event
    emitBoardUpdate(board._id, 'column-added', board);

    res.json(board);
  } catch (error) {
    console.error('Error adding column:', error);
    res.status(500).json({ error: 'Failed to add column' });
  }
});

// Add a task to a column
router.post('/:boardId/columns/:columnId/tasks', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const columnIndex = parseInt(req.params.columnId);
    if (isNaN(columnIndex)) {
      return res.status(400).json({ error: 'Invalid column index' });
    }

    const column = board.columns[columnIndex];
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    const task = {
      ...req.body,
      createdBy: req.user._id,
      status: column.title.toLowerCase().replace(/\s+/g, '-')
    };

    if (!task.title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // Add task to column
    column.tasks.push(task);

    // Save board with new task
    await board.save();

    // Populate the task's references
    const populatedBoard = await Board.findById(board._id)
      .populate('columns.tasks.assignee', 'name email avatar')
      .populate('columns.tasks.createdBy', 'name email avatar');

    const populatedTask = populatedBoard.columns[columnIndex].tasks.slice(-1)[0];

    // Emit task creation event
    emitBoardUpdate(board._id, 'task-added', {
      columnId: columnIndex,
      task: populatedTask
    });

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: error.message || 'Failed to add task' });
  }
});

// Move a task between columns
router.put('/:boardId/tasks/:taskId/move', auth, async (req, res) => {
  try {
    const { sourceColumnIndex, destinationColumnIndex, newPosition } = req.body;
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    await board.moveTask(req.params.taskId, sourceColumnIndex, destinationColumnIndex, newPosition);

    // Emit task move event
    emitBoardUpdate(board._id, 'task-moved', {
      taskId: req.params.taskId,
      sourceColumnIndex,
      destinationColumnIndex,
      newPosition
    });

    res.json(board);
  } catch (error) {
    console.error('Error moving task:', error);
    res.status(500).json({ error: 'Failed to move task' });
  }
});

// Update task
router.put('/:boardId/columns/:columnId/tasks/:taskId', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const column = board.columns.id(req.params.columnId);
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    const task = column.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update task fields
    Object.assign(task, req.body);
    await board.save();

    // Emit task update event
    emitBoardUpdate(board._id, 'task-updated', {
      columnId: req.params.columnId,
      task
    });

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Add comment to task
router.post('/:boardId/columns/:columnId/tasks/:taskId/comments', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const column = board.columns.id(req.params.columnId);
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    const task = column.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const comment = {
      text: req.body.text,
      user: req.user._id
    };

    task.comments.push(comment);
    await board.save();

    // Emit comment added event
    emitBoardUpdate(board._id, 'comment-added', {
      columnId: req.params.columnId,
      taskId: req.params.taskId,
      comment
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Archive a column
router.put('/:boardId/columns/:columnId/archive', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    await board.archiveColumn(req.params.columnId);

    // Emit column archived event
    emitBoardUpdate(board._id, 'column-archived', {
      columnId: req.params.columnId
    });

    res.json({ message: 'Column archived successfully' });
  } catch (error) {
    console.error('Error archiving column:', error);
    res.status(500).json({ error: 'Failed to archive column' });
  }
});

// Update board settings
router.put('/:boardId/settings', auth, async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      {
        _id: req.params.boardId,
        'members.user': req.user._id,
        'members.role': 'admin'
      },
      { $set: { settings: req.body } },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ error: 'Board not found or insufficient permissions' });
    }

    // Emit settings updated event
    emitBoardUpdate(board._id, 'settings-updated', board.settings);

    res.json(board.settings);
  } catch (error) {
    console.error('Error updating board settings:', error);
    res.status(500).json({ error: 'Failed to update board settings' });
  }
});

// Update a board
router.put('/:boardId', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id,
      isArchived: false
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Check if user has admin rights for sensitive updates
    const userMember = board.members.find(member => 
      member.user.toString() === req.user._id.toString()
    );
    
    const isSensitiveUpdate = req.body.members || req.body.isArchived;
    if (isSensitiveUpdate && (!userMember || userMember.role !== 'admin')) {
      return res.status(403).json({ error: 'Only board admins can modify members or archive status' });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'members', 'isArchived', 'backgroundColor'];
    const updates = Object.keys(req.body).filter(update => allowedUpdates.includes(update));
    
    updates.forEach(update => {
      board[update] = req.body[update];
    });

    await board.save();

    // Populate references
    await board.populate('members.user', 'name email avatar');
    await board.populate('createdBy', 'name email avatar');
    
    // Emit board update event
    emitBoardUpdate(board._id, 'board-updated', board);
    
    res.json(board);
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
});

// Delete a board
router.delete('/:boardId', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Check if user has admin rights
    const userMember = board.members.find(member => 
      member.user.toString() === req.user._id.toString()
    );
    
    if (!userMember || userMember.role !== 'admin') {
      return res.status(403).json({ error: 'Only board admins can delete boards' });
    }

    await Board.deleteOne({ _id: req.params.boardId });
    
    // Emit board deletion event
    emitBoardUpdate(board._id, 'board-deleted', { boardId: board._id });
    
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

export default router;