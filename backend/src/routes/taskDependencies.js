const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Add dependency to a task
router.post('/tasks/:taskId/dependencies', auth, async (req, res) => {
  try {
    const { dependencyId } = req.body;
    const task = await Task.findById(req.params.taskId);
    const dependencyTask = await Task.findById(dependencyId);

    if (!task || !dependencyTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check for circular dependencies
    if (await hasCircularDependency(task._id, dependencyId)) {
      return res.status(400).json({ message: 'Circular dependency detected' });
    }

    if (!task.dependencies.includes(dependencyId)) {
      task.dependencies.push(dependencyId);
      await task.save();
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove dependency from a task
router.delete('/tasks/:taskId/dependencies/:dependencyId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.dependencies = task.dependencies.filter(
      (dep) => dep.toString() !== req.params.dependencyId
    );
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to check for circular dependencies
async function hasCircularDependency(taskId, newDependencyId, visited = new Set()) {
  if (visited.has(taskId.toString())) {
    return false;
  }
  
  if (taskId.toString() === newDependencyId.toString()) {
    return true;
  }

  visited.add(taskId.toString());
  const task = await Task.findById(taskId);
  
  for (const depId of task.dependencies) {
    if (await hasCircularDependency(depId, newDependencyId, visited)) {
      return true;
    }
  }

  return false;
}

module.exports = router;
