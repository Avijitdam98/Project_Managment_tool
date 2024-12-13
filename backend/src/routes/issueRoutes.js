import express from 'express';
import { auth } from '../middleware/auth.js';
import Issue from '../models/Issue.js';
import Project from '../models/Project.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = express.Router();

// Create a new issue
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is member of the project
    const project = await Project.findOne({
      _id: req.body.project,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send({ error: 'Project not found or access denied' });
    }

    const issue = new Issue({
      ...req.body,
      reporter: req.user._id
    });
    await issue.save();
    
    res.status(201).send(issue);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all issues for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const match = { project: req.params.projectId };
    const sort = {};

    // Add filters based on query parameters
    if (req.query.status) {
      match.status = req.query.status;
    }
    if (req.query.assignee) {
      match.assignee = req.query.assignee;
    }
    if (req.query.priority) {
      match.priority = req.query.priority;
    }
    if (req.query.type) {
      match.issueType = req.query.type;
    }
    if (req.query.label) {
      match.labels = req.query.label;
    }

    // Add sorting
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const issues = await Issue.find(match)
      .populate('assignee', 'name email')
      .populate('reporter', 'name email')
      .sort(sort)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip));

    res.send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get issue by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('reporter', 'name email')
      .populate('watchers', 'name email')
      .populate('comments.author', 'name email');
    
    if (!issue) {
      return res.status(404).send();
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: issue.project,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send({ error: 'Access denied' });
    }

    res.send(issue);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update issue
router.patch('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).send();
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: issue.project,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send({ error: 'Access denied' });
    }

    const updates = Object.keys(req.body);
    updates.forEach(update => issue[update] = req.body[update]);
    await issue.save();
    
    res.send(issue);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete issue
router.delete('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).send();
    }

    // Check if user has admin access to the project
    const project = await Project.findOne({
      _id: issue.project,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send({ error: 'Access denied' });
    }

    const member = project.members.find(m => m.user.toString() === req.user._id.toString());
    if (member.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can delete issues' });
    }

    await issue.remove();
    res.send(issue);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add comment to issue
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).send();
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: issue.project,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send({ error: 'Access denied' });
    }

    issue.comments.push({
      content: req.body.content,
      author: req.user._id,
      mentions: req.body.mentions
    });
    
    await issue.save();
    res.status(201).send(issue);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add attachment to issue
router.post('/:id/attachments', auth, upload.single('file'), async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).send();
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: issue.project,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send({ error: 'Access denied' });
    }

    if (!project.settings.allowAttachments) {
      return res.status(403).send({ error: 'Attachments are not allowed in this project' });
    }

    const attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id
    };

    issue.attachments.push(attachment);
    await issue.save();
    
    res.send(attachment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add/remove watcher
router.post('/:id/watch', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).send();
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: issue.project,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send({ error: 'Access denied' });
    }

    const isWatching = issue.watchers.includes(req.user._id);
    if (isWatching) {
      issue.watchers = issue.watchers.filter(w => w.toString() !== req.user._id.toString());
    } else {
      issue.watchers.push(req.user._id);
    }
    
    await issue.save();
    res.send({ watching: !isWatching });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
