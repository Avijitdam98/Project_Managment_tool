import express from 'express';
import { auth } from '../middleware/auth.js';
import { Board } from '../models/Board.js';
import { Task } from '../models/Task.js'; // Import Task model
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
    .populate({
      path: 'columns.tasks',
      populate: [
        { path: 'assignee', select: 'name email avatar' },
        { path: 'createdBy', select: 'name email avatar' }
      ]
    })
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
    console.log('[Board Fetch] Fetching board:', req.params.boardId);

    // First, get all tasks for this board
    const tasks = await Task.find({ 
      board: req.params.boardId,
      isArchived: false 
    })
    .populate('assignee', 'name email avatar status')
    .populate('createdBy', 'name email avatar')
    .lean()
    .exec();

    console.log('[Board Fetch] Found tasks:', tasks.length);

    // Group tasks by column
    const tasksByColumn = tasks.reduce((acc, task) => {
      if (typeof task.column === 'number') {
        if (!acc[task.column]) {
          acc[task.column] = [];
        }
        acc[task.column].push(task);
      }
      return acc;
    }, {});

    console.log('[Board Fetch] Tasks grouped by column:', 
      Object.keys(tasksByColumn).map(col => ({ 
        column: col, 
        taskCount: tasksByColumn[col].length 
      }))
    );

    // Get the board
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id,
      isArchived: false
    })
    .populate('members.user', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .lean()
    .exec();

    if (!board) {
      console.log('[Board Fetch] Board not found:', req.params.boardId);
      return res.status(404).json({ error: 'Board not found' });
    }

    // Ensure columns exist
    if (!board.columns) {
      board.columns = [];
    }

    // Merge tasks into columns
    board.columns = board.columns.map((column, index) => ({
      ...column,
      tasks: tasksByColumn[index] || []
    }));

    console.log('[Board Fetch] Final board structure:', {
      id: board._id,
      columns: board.columns.map(c => ({
        title: c.title,
        taskCount: c.tasks.length
      }))
    });

    res.json(board);
  } catch (error) {
    console.error('[Board Fetch] Error:', error);
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
    console.log('[Task Creation] Step 1: Starting task creation with data:', {
      boardId: req.params.boardId,
      columnId: req.params.columnId,
      userId: req.user._id,
      taskData: req.body
    });

    // Find board and ensure it exists
    const board = await Board.findOne({
      _id: req.params.boardId,
      'members.user': req.user._id
    }).lean().exec();

    if (!board) {
      console.log('[Task Creation] Board not found:', req.params.boardId);
      return res.status(404).json({ error: 'Board not found' });
    }

    console.log('[Task Creation] Step 2: Found board:', board._id);
    console.log('[Task Creation] Board columns:', board.columns?.map(c => ({
      title: c.title,
      tasksCount: Array.isArray(c.tasks) ? c.tasks.length : 0
    })) || []);

    // Convert columnId to column index
    const columnIndex = parseInt(req.params.columnId);
    if (isNaN(columnIndex) || !board.columns || columnIndex < 0 || columnIndex >= board.columns.length) {
      console.log('[Task Creation] Invalid column index:', columnIndex, 'max:', (board.columns?.length || 0) - 1);
      return res.status(400).json({ error: 'Invalid column index' });
    }

    // Create new task with column index
    const taskData = {
      ...req.body,
      board: board._id,
      column: columnIndex,
      createdBy: req.user._id,
      status: columnIndex === 0 ? 'to-do' : columnIndex === 1 ? 'in-progress' : 'done'
    };

    console.log('[Task Creation] Step 3: Creating task with data:', taskData);

    const newTask = await Task.create(taskData);
    console.log('[Task Creation] Step 4: Task created:', newTask);

    // Update board with new task
    const updatedBoard = await Board.findOneAndUpdate(
      { 
        _id: board._id,
        'members.user': req.user._id
      },
      { 
        $push: { 
          [`columns.${columnIndex}.tasks`]: newTask._id 
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedBoard) {
      console.log('[Task Creation] Failed to update board with task');
      await Task.findByIdAndDelete(newTask._id);
      return res.status(500).json({ error: 'Failed to update board with task' });
    }

    console.log('[Task Creation] Step 5: Updated board column tasks:', {
      columnIndex,
      tasksCount: updatedBoard.columns[columnIndex].tasks.length,
      lastTaskId: updatedBoard.columns[columnIndex].tasks[updatedBoard.columns[columnIndex].tasks.length - 1]
    });

    // Populate task data
    const populatedTask = await Task.findById(newTask._id)
      .populate('assignee', 'name email avatar status')
      .populate('board', 'title')
      .populate('createdBy', 'name email avatar');

    console.log('[Task Creation] Step 6: Task populated:', populatedTask);

    // Emit socket event
    emitBoardUpdate(board._id, 'task-created', {
      task: populatedTask,
      boardId: board._id,
      columnIndex
    });

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('[Task Creation] Error:', error);
    console.error('[Task Creation] Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create task',
      details: error.message 
    });
  }
});

// Move a task between columns
router.put('/:boardId/tasks/:taskId/move', auth, async (req, res) => {
  try {
    console.log('[Task Move] Starting task move:', {
      boardId: req.params.boardId,
      taskId: req.params.taskId,
      sourceIndex: req.body.sourceColumnIndex,
      destIndex: req.body.destinationColumnIndex,
      position: req.body.position
    });

    // First, update the task's column
    const task = await Task.findOneAndUpdate(
      { 
        _id: req.params.taskId,
        board: req.params.boardId
      },
      { 
        $set: { 
          column: req.body.destinationColumnIndex,
          status: req.body.destinationColumnIndex === 0 ? 'to-do' : 
                 req.body.destinationColumnIndex === 1 ? 'in-progress' : 'done'
        }
      },
      { new: true }
    ).populate('assignee', 'name email avatar status')
     .populate('createdBy', 'name email avatar');

    if (!task) {
      console.log('[Task Move] Task not found:', req.params.taskId);
      return res.status(404).json({ error: 'Task not found' });
    }

    console.log('[Task Move] Updated task column:', task.column);

    // Then, update the board's columns
    const board = await Board.findOneAndUpdate(
      { 
        _id: req.params.boardId,
        'members.user': req.user._id
      },
      { 
        $pull: { 
          [`columns.${req.body.sourceColumnIndex}.tasks`]: task._id 
        }
      },
      { new: true }
    );

    if (!board) {
      console.log('[Task Move] Board not found:', req.params.boardId);
      return res.status(404).json({ error: 'Board not found' });
    }

    console.log('[Task Move] Removed task from source column');

    // Add task to destination column
    const position = typeof req.body.position === 'number' ? req.body.position : board.columns[req.body.destinationColumnIndex].tasks.length;
    
    const updatedBoard = await Board.findOneAndUpdate(
      { 
        _id: req.params.boardId,
        'members.user': req.user._id
      },
      { 
        $push: { 
          [`columns.${req.body.destinationColumnIndex}.tasks`]: {
            $each: [task._id],
            $position: position
          }
        }
      },
      { new: true }
    )
    .populate('members.user', 'name email avatar')
    .populate('createdBy', 'name email avatar');

    console.log('[Task Move] Added task to destination column at position:', position);

    // Emit board update
    emitBoardUpdate(board._id, 'task-moved', {
      task,
      boardId: board._id,
      sourceColumnIndex: req.body.sourceColumnIndex,
      destinationColumnIndex: req.body.destinationColumnIndex,
      position
    });

    res.json({ board: updatedBoard, task });
  } catch (error) {
    console.error('[Task Move] Error:', error);
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