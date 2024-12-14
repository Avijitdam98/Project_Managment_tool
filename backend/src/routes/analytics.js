import express from 'express';
import { Board } from '../models/Board.js';
import { Task } from '../models/Task.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get analytics for a board
router.get('/boards/:boardId/analytics', auth, async (req, res) => {
  try {
    const boardId = req.params.boardId;
    console.log('Fetching analytics for board:', boardId);

    // Get the board with populated tasks
    const board = await Board.findById(boardId)
      .populate({
        path: 'columns.tasks',
        populate: [
          { path: 'assignee', select: 'name email avatar' },
          { path: 'dependencies' }
        ]
      });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Get all tasks from all columns
    const allTasks = board.columns.reduce((tasks, column) => {
      if (!column.isArchived) {
        return tasks.concat(column.tasks.filter(task => !task.isArchived));
      }
      return tasks;
    }, []);

    console.log('Found tasks:', allTasks.length);

    // If no tasks, return default values
    if (!allTasks || allTasks.length === 0) {
      return res.json({
        tasksByStatus: {
          todo: 0,
          inProgress: 0,
          done: 0,
          blocked: 0,
        },
        tasksByPriority: {
          high: 0,
          medium: 0,
          low: 0,
        },
        tasksByColumn: {},
        columnTitles: board.columns.filter(col => !col.isArchived).map(col => col.title),
        totalTasks: 0,
        activeUsers: 0,
        averageTaskCompletion: 0,
        tasksDueSoon: 0,
        tasksWithDependencies: 0,
        timeAccuracy: 0,
        recentActivity: {
          completed: 0,
          inProgress: 0,
          blocked: 0
        }
      });
    }

    // Calculate tasks by column
    const tasksByColumn = {};
    board.columns.forEach(column => {
      if (!column.isArchived) {
        tasksByColumn[column.title] = column.tasks.filter(task => !task.isArchived).length;
      }
    });

    // Calculate task status distribution
    const tasksByStatus = {
      todo: allTasks.filter(task => 
        task.status === 'pending' || 
        board.columns.find(col => !col.isArchived && col.title.toLowerCase().includes('todo'))?.tasks.includes(task)
      ).length,
      inProgress: allTasks.filter(task => 
        task.status === 'inProgress' || 
        board.columns.find(col => !col.isArchived && col.title.toLowerCase().includes('progress'))?.tasks.includes(task)
      ).length,
      done: allTasks.filter(task => 
        task.status === 'completed' || 
        board.columns.find(col => !col.isArchived && col.title.toLowerCase().includes('done'))?.tasks.includes(task)
      ).length,
      blocked: allTasks.filter(task => task.status === 'blocked').length,
    };

    // Calculate tasks by priority
    const tasksByPriority = {
      high: allTasks.filter(task => task.priority === 'high').length,
      medium: allTasks.filter(task => task.priority === 'medium').length,
      low: allTasks.filter(task => task.priority === 'low').length,
    };

    // Calculate average task completion time (for completed tasks)
    const completedTasks = allTasks.filter(task => 
      task.status === 'completed' || 
      board.columns.find(col => !col.isArchived && col.title.toLowerCase().includes('done'))?.tasks.includes(task)
    );
    const averageTaskCompletion = completedTasks.length > 0
      ? completedTasks.reduce((acc, task) => {
          const completionTime = task.updatedAt ? new Date(task.updatedAt) - new Date(task.createdAt) : 0;
          return acc + (completionTime / (1000 * 60 * 60 * 24)); // Convert to days
        }, 0) / completedTasks.length
      : 0;

    // Get number of active users (users with assigned tasks)
    const uniqueAssignees = new Set(allTasks.filter(task => task.assignee).map(task => 
      task.assignee._id.toString()
    ));
    const activeUsers = uniqueAssignees.size;

    // Get tasks due soon (next 7 days)
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const tasksDueSoon = allTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= sevenDaysFromNow;
    }).length;

    // Get tasks with dependencies
    const tasksWithDependencies = allTasks.filter(task => 
      task.dependencies && task.dependencies.length > 0
    ).length;

    // Calculate time estimation accuracy
    const tasksWithTimes = allTasks.filter(task => 
      task.estimatedTime && task.actualTime && 
      (task.status === 'completed' || 
       board.columns.find(col => !col.isArchived && col.title.toLowerCase().includes('done'))?.tasks.includes(task))
    );
    const timeAccuracy = tasksWithTimes.length > 0
      ? tasksWithTimes.reduce((acc, task) => {
          const accuracy = task.actualTime / task.estimatedTime;
          return acc + accuracy;
        }, 0) / tasksWithTimes.length
      : 0;

    // Compile analytics data
    const analyticsData = {
      tasksByStatus,
      tasksByPriority,
      tasksByColumn,
      columnTitles: board.columns.filter(col => !col.isArchived).map(col => col.title),
      totalTasks: allTasks.length,
      activeUsers,
      averageTaskCompletion: parseFloat(averageTaskCompletion.toFixed(1)),
      tasksDueSoon,
      tasksWithDependencies,
      timeAccuracy: parseFloat(timeAccuracy.toFixed(2)),
      recentActivity: {
        completed: completedTasks.length,
        inProgress: tasksByStatus.inProgress,
        blocked: tasksByStatus.blocked
      }
    };

    console.log('Sending analytics data:', analyticsData);
    res.json(analyticsData);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      message: 'Error fetching analytics data',
      error: error.message 
    });
  }
});

export default router;
