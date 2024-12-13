import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  status: String,
  isArchived: { type: Boolean, default: false }
}, { 
  timestamps: true,
  strict: false // Allow additional fields
});

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tasks: [taskSchema],
  order: { type: Number, required: true },
  color: { type: String, default: '#E2E8F0' },
  isArchived: { type: Boolean, default: false }
});

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  background: {
    type: { type: String, enum: ['color', 'image'], default: 'color' },
    value: { type: String, default: '#2C3E50' }
  },
  visibility: {
    type: String,
    enum: ['private', 'team', 'public'],
    default: 'private'
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'editor' }
  }],
  columns: [columnSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

// Method to add a new column
boardSchema.methods.addColumn = async function(columnData) {
  const maxOrder = this.columns.reduce((max, col) => Math.max(max, col.order), -1);
  this.columns.push({
    ...columnData,
    order: maxOrder + 1
  });
  return this.save();
};

// Method to move a task between columns
boardSchema.methods.moveTask = async function(taskId, sourceColIndex, destColIndex, newPosition) {
  const sourceColumn = this.columns[sourceColIndex];
  const destColumn = this.columns[destColIndex];
  
  if (!sourceColumn || !destColumn) {
    throw new Error('Invalid column index');
  }

  const taskIndex = sourceColumn.tasks.findIndex(task => task._id.toString() === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  // Remove task from source column
  const [task] = sourceColumn.tasks.splice(taskIndex, 1);
  
  // Insert task at new position in destination column
  destColumn.tasks.splice(newPosition, 0, task);
  
  return this.save();
};

// Method to archive a column
boardSchema.methods.archiveColumn = async function(columnId) {
  const column = this.columns.id(columnId);
  if (!column) {
    throw new Error('Column not found');
  }
  column.isArchived = true;
  return this.save();
};

export const Board = mongoose.model('Board', boardSchema);