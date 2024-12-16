import React, { useState } from 'react';
import { format } from 'date-fns';
import { FaCalendar, FaFlag, FaUser, FaEllipsisH, FaCheckSquare, FaComment, FaPaperclip, FaTag, FaUserCircle, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoardDetails } from '../store/boardSlice';
import { toast } from 'react-toastify';
import api from '../utils/api';

const priorityColors = {
  low: {
    gradient: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  },
  medium: {
    gradient: 'from-amber-500 to-yellow-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200'
  },
  high: {
    gradient: 'from-rose-500 to-red-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200'
  }
};

const TaskCard = ({ task, index }) => {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const board = useSelector(state => state.boards.currentBoard);
  const priorityColor = priorityColors[task.priority] || priorityColors.medium;

  const handleEdit = () => {
    setShowMenu(false);
    // Implement edit functionality
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/api/tasks/${task._id}`);
      if (response.status === 200) {
        dispatch(fetchBoardDetails(board._id));
        setShowMenu(false);
        toast.success('Task deleted successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(3deg)`
              : provided.draggableProps.style?.transform
          }}
          className={`
            group relative
            bg-white dark:bg-gray-800 
            rounded-xl shadow-sm
            hover:shadow-md
            transition-all duration-200
            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500/20 z-50' : ''}
          `}
        >
          {/* Priority Gradient Bar */}
          <div className={`
            absolute top-0 left-0 right-0 h-1 rounded-t-xl
            bg-gradient-to-r ${priorityColor.gradient}
          `} />

          <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {task.title}
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FaEllipsisH className="w-4 h-4 text-gray-500" />
                </button>
                
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 z-50 overflow-hidden"
                  >
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <FaEdit className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-200">Edit Task</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <FaTrash className="w-4 h-4 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">Delete Task</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center gap-2 mb-3">
                {task.assignee.avatar ? (
                  <img 
                    src={task.assignee.avatar} 
                    alt={task.assignee.name} 
                    className="w-6 h-6 rounded-full ring-2 ring-primary-100"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-2 ring-primary-100">
                    <span className="text-xs font-medium text-white">
                      {task.assignee.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {task.assignee.name}
                </span>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
              {/* Priority Badge */}
              <div className={`
                flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                ${priorityColor.bg} ${priorityColor.text}
              `}>
                <FaFlag className="w-3 h-3" />
                <span className="capitalize">{task.priority}</span>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <FaCalendar className="w-3 h-3" />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;