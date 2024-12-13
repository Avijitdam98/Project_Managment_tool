import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['TASK_ASSIGNED', 'TASK_UPDATE', 'MENTION', 'DUE_DATE', 'BOARD_INVITE'],
    required: true
  },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
