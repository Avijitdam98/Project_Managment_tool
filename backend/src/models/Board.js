import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tasks: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    default: () => []
  },
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
    role: { type: String, enum: ['admin', 'member'], default: 'member' }
  }],
  columns: {
    type: [columnSchema],
    required: true,
    default: () => ([
      { title: 'To Do', order: 0, color: '#E2E8F0', tasks: [] },
      { title: 'In Progress', order: 1, color: '#EBF8FF', tasks: [] },
      { title: 'Done', order: 2, color: '#F0FFF4', tasks: [] }
    ])
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isArchived: { type: Boolean, default: false }
}, { 
  timestamps: true,
  strict: true
});

// Ensure columns and tasks arrays are always initialized
boardSchema.pre('save', function(next) {
  // Initialize columns if undefined
  if (!this.columns) {
    this.columns = boardSchema.path('columns').defaultValue();
  }

  // Ensure each column has a tasks array
  this.columns.forEach(column => {
    if (!column.tasks) {
      column.tasks = [];
    }
  });

  next();
});

// Method to add a new column
boardSchema.methods.addColumn = async function(columnData) {
  const maxOrder = this.columns.reduce((max, col) => Math.max(max, col.order), -1);
  this.columns.push({
    ...columnData,
    order: maxOrder + 1,
    tasks: []
  });
  return this.save();
};

// Method to move a task between columns
boardSchema.methods.moveTask = async function(taskId, sourceColIndex, destColIndex, newPosition) {
  // Validate column indices
  if (!this.columns || sourceColIndex < 0 || destColIndex < 0 || 
      sourceColIndex >= this.columns.length || destColIndex >= this.columns.length) {
    throw new Error('Invalid column index');
  }

  const sourceCol = this.columns[sourceColIndex];
  const destCol = this.columns[destColIndex];

  // Ensure tasks arrays exist
  if (!sourceCol.tasks) sourceCol.tasks = [];
  if (!destCol.tasks) destCol.tasks = [];

  // Find task in source column
  const taskIndex = sourceCol.tasks.findIndex(id => id.toString() === taskId.toString());
  if (taskIndex === -1) {
    throw new Error('Task not found in source column');
  }

  // Move task
  const [task] = sourceCol.tasks.splice(taskIndex, 1);
  if (typeof newPosition !== 'number' || newPosition >= destCol.tasks.length) {
    destCol.tasks.push(task);
  } else {
    destCol.tasks.splice(newPosition, 0, task);
  }

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