import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: String,
  mimeType: String,
  size: Number,
  url: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [attachmentSchema],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const issueSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  issueType: {
    type: String,
    required: true,
    enum: ['Bug', 'Task', 'Story', 'Epic']
  },
  priority: {
    type: String,
    required: true,
    enum: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
    default: 'Medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'Review', 'Done'],
    default: 'Open'
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date
  },
  labels: [{
    type: String
  }],
  attachments: [attachmentSchema],
  comments: [commentSchema],
  watchers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  },
  subtasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  }],
  timeTracking: {
    originalEstimate: Number, // in minutes
    remainingEstimate: Number,
    timeSpent: Number
  },
  customFields: [{
    name: String,
    value: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Add indexes for better query performance
issueSchema.index({ project: 1, summary: 'text', description: 'text' });
issueSchema.index({ project: 1, status: 1 });
issueSchema.index({ project: 1, assignee: 1 });
issueSchema.index({ project: 1, reporter: 1 });
issueSchema.index({ project: 1, dueDate: 1 });
issueSchema.index({ project: 1, labels: 1 });

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
