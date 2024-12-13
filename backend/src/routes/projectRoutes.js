import express from 'express';
import { auth } from '../middleware/auth.js';
import Project from '../models/Project.js';
import Issue from '../models/Issue.js';
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

// Create a new project
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      'members.user': req.user._id
    }).populate('owner', 'name email');
    res.send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      'members.user': req.user._id
    }).populate('owner', 'name email')
      .populate('members.user', 'name email');
    
    if (!project) {
      return res.status(404).send();
    }
    res.send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update project
router.patch('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send();
    }

    // Check if user is admin
    const member = project.members.find(m => m.user.toString() === req.user._id.toString());
    if (member.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can update project settings' });
    }

    const updates = Object.keys(req.body);
    updates.forEach(update => project[update] = req.body[update]);
    await project.save();
    
    res.send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send();
    }

    // Check if user is admin
    const member = project.members.find(m => m.user.toString() === req.user._id.toString());
    if (member.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can delete projects' });
    }

    await project.remove();
    res.send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add member to project
router.post('/:id/members', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send();
    }

    // Check if user is admin
    const member = project.members.find(m => m.user.toString() === req.user._id.toString());
    if (member.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can add members' });
    }

    project.members.push({
      user: req.body.userId,
      role: req.body.role || 'member'
    });
    
    await project.save();
    res.send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Remove member from project
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send();
    }

    // Check if user is admin
    const member = project.members.find(m => m.user.toString() === req.user._id.toString());
    if (member.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can remove members' });
    }

    project.members = project.members.filter(m => m.user.toString() !== req.params.userId);
    await project.save();
    
    res.send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get project statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send();
    }

    const stats = await Issue.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: null,
          totalIssues: { $sum: 1 },
          openIssues: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Open'] }, 1, 0]
            }
          },
          completedIssues: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Done'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.send(stats[0] || { totalIssues: 0, openIssues: 0, completedIssues: 0 });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Upload attachment
router.post('/:id/attachments', auth, upload.single('file'), async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      'members.user': req.user._id
    });
    
    if (!project) {
      return res.status(404).send();
    }

    if (!project.settings.allowAttachments) {
      return res.status(403).send({ error: 'Attachments are not allowed in this project' });
    }

    if (req.file.size > project.settings.maxAttachmentSize) {
      return res.status(400).send({ error: 'File size exceeds the limit' });
    }

    const attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id
    };

    res.send(attachment);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
