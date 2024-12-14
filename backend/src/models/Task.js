import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  column: { type: String, enum: ['todo', 'inProgress', 'done'], required: true },
  dueDate: Date,
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  attachments: [String],
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  status: { 
    type: String, 
    enum: ['pending', 'inProgress', 'completed', 'blocked'], 
    default: 'pending' 
  },
  estimatedTime: { type: Number }, // in hours
  actualTime: { type: Number }, // in hours
  tags: [String],
}, { timestamps: true });

// Add index for better query performance
taskSchema.index({ board: 1, column: 1 });
taskSchema.index({ assignee: 1, status: 1 });

export const Task = mongoose.model('Task', taskSchema);