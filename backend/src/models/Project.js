import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  key: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    }
  }],
  issueTypes: [{
    name: {
      type: String,
      required: true
    },
    icon: String,
    color: String
  }],
  labels: [{
    name: {
      type: String,
      required: true
    },
    color: String
  }],
  priorities: [{
    name: {
      type: String,
      required: true
    },
    color: String,
    icon: String
  }],
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  settings: {
    allowAttachments: {
      type: Boolean,
      default: true
    },
    maxAttachmentSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 10MB
    },
    defaultAssignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
projectSchema.index({ name: 'text', description: 'text' });
projectSchema.index({ key: 1 });
projectSchema.index({ 'members.user': 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
