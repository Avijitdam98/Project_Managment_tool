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

// Delete task endpoint
router.delete('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: 'Task deleted successfully', taskId: req.params.taskId });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a dependency to a task
router.post('/:taskId/dependencies', auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { dependencyTaskId, type } = req.body;

    // Validate dependency type
    const validTypes = ['blocks', 'blocked-by', 'relates-to'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid dependency type' });
    }

    // Check if tasks exist
    const [task, dependencyTask] = await Promise.all([
      Task.findById(taskId),
      Task.findById(dependencyTaskId)
    ]);

    if (!task || !dependencyTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check for circular dependencies
    if (type === 'blocks' || type === 'blocked-by') {
      const hasCircular = await checkCircularDependency(taskId, dependencyTaskId);
      if (hasCircular) {
        return res.status(400).json({ error: 'Circular dependency detected' });
      }
    }

    // Add dependency
    task.dependencies.push({
      task: dependencyTaskId,
      type
    });

    await task.save();
    
    // If type is 'blocks', add reverse dependency
    if (type === 'blocks') {
      dependencyTask.dependencies.push({
        task: taskId,
        type: 'blocked-by'
      });
      await dependencyTask.save();
    }
    // If type is 'blocked-by', add reverse dependency
    else if (type === 'blocked-by') {
      dependencyTask.dependencies.push({
        task: taskId,
        type: 'blocks'
      });
      await dependencyTask.save();
    }

    await task.populate('dependencies.task', 'title status');
    res.json(task);
  } catch (error) {
    console.error('Error adding dependency:', error);
    res.status(500).json({ error: 'Failed to add dependency' });
  }
});

// Remove a dependency from a task
router.delete('/:taskId/dependencies/:dependencyId', auth, async (req, res) => {
  try {
    const { taskId, dependencyId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Find the dependency to get its type before removing it
    const dependency = task.dependencies.find(d => d.task.toString() === dependencyId);
    if (!dependency) {
      return res.status(404).json({ error: 'Dependency not found' });
    }

    // Remove the dependency from the task
    task.dependencies = task.dependencies.filter(d => d.task.toString() !== dependencyId);
    await task.save();

    // Remove the reverse dependency if it exists
    if (dependency.type === 'blocks' || dependency.type === 'blocked-by') {
      const dependencyTask = await Task.findById(dependencyId);
      if (dependencyTask) {
        const reverseType = dependency.type === 'blocks' ? 'blocked-by' : 'blocks';
        dependencyTask.dependencies = dependencyTask.dependencies.filter(
          d => d.task.toString() !== taskId || d.type !== reverseType
        );
        await dependencyTask.save();
      }
    }

    // Populate the dependencies before sending response
    await task.populate('dependencies.task', 'title status');
    res.json(task);
  } catch (error) {
    console.error('Error removing dependency:', error);
    res.status(500).json({ error: 'Failed to remove dependency' });
  }
});

// Helper function to check for circular dependencies
async function checkCircularDependency(taskId, dependencyId, visited = new Set()) {
  if (visited.has(taskId)) {
    return taskId === dependencyId;
  }

  visited.add(taskId);
  const task = await Task.findById(taskId);
  
  if (!task) {
    return false;
  }

  const blockingDependencies = task.dependencies
    .filter(d => d.type === 'blocks')
    .map(d => d.task.toString());

  for (const depId of blockingDependencies) {
    if (await checkCircularDependency(depId, dependencyId, visited)) {
      return true;
    }
  }

  return false;
}

export default router;