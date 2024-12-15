import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  column: { type: Number, required: true }, 
  dueDate: Date,
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  labels: [{
    value: String,
    label: String,
    color: String
  }],
  checklist: [{
    text: String,
    completed: { type: Boolean, default: false }
  }],
  attachments: [String],
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  status: { 
    type: String, 
    enum: ['to-do', 'in-progress', 'done'], 
    default: 'to-do' 
  },
  estimatedTime: { type: Number }, 
  actualTime: { type: Number }, 
  tags: [String],
  isArchived: { type: Boolean, default: false }
}, { 
  timestamps: true,
  strict: true 
});

taskSchema.index({ board: 1, column: 1 });
taskSchema.index({ assignee: 1, status: 1 });

taskSchema.pre('save', function(next) {
  if (typeof this.column !== 'number' || this.column < 0) {
    next(new Error('Column must be a non-negative number'));
  }
  next();
});

export const Task = mongoose.model('Task', taskSchema);