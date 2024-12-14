import React, { useState } from 'react';
import { format } from 'date-fns';
import { FaCalendar, FaFlag, FaUser, FaEllipsisH, FaCheckSquare, FaComment, FaPaperclip, FaTag, FaUserCircle, FaPlus } from 'react-icons/fa';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateTask } from '../store/taskSlice';
import { toast } from 'react-toastify';

const priorityColors = {
  low: {
    gradient: 'from-green-400 via-green-500 to-green-600',
    bg: 'bg-green-50 dark:bg-green-900/10',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-400',
    shadow: 'shadow-green-500/20'
  },
  medium: {
    gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
    bg: 'bg-yellow-50 dark:bg-yellow-900/10',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-700 dark:text-yellow-400',
    shadow: 'shadow-yellow-500/20'
  },
  high: {
    gradient: 'from-red-400 via-red-500 to-red-600',
    bg: 'bg-red-50 dark:bg-red-900/10',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-400',
    shadow: 'shadow-red-500/20'
  }
};

const TaskCard = ({ task, index }) => {
  const priorityColor = priorityColors[task.priority] || priorityColors.medium;
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAssign = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/tasks/${task._id}/assign`, { userId });
      dispatch(updateTask(response.data));
      toast.success('Task assigned successfully');
      setShowAssignMenu(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group relative rounded-xl
            ${snapshot.isDragging ? 'z-50' : ''}
            transition-all duration-200 ease-out
          `}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(2deg) scale(1.05)`
              : provided.draggableProps.style?.transform
          }}
        >
          {/* Card Background with Priority Side Bar */}
          <div className={`
            relative overflow-hidden
            bg-white dark:bg-gray-800 rounded-xl
            shadow-lg ${priorityColor.shadow} 
            ${priorityColor.border}
            transition-shadow duration-200
            ${snapshot.isDragging ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-lg'}
          `}>
            {/* Priority Gradient Side Bar */}
            <div className={`
              absolute left-0 top-0 bottom-0 w-1.5
              bg-gradient-to-b ${priorityColor.gradient}
            `} />

            {/* Card Content */}
            <div className="relative p-4 pl-6">
              {/* Task Title and Priority */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {task.title}
                </h3>
                <div className={`
                  flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
                  ${priorityColor.bg} ${priorityColor.text}
                  border ${priorityColor.border}
                `}>
                  <FaFlag className="w-3 h-3" />
                  <span className="capitalize">{task.priority}</span>
                </div>
              </div>

              {/* Task Description */}
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Assignee Section */}
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-between">
                  <span>Assigned to:</span>
                  <button 
                    onClick={() => setShowAssignMenu(!showAssignMenu)}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    <FaPlus className="w-3 h-3" />
                    <span>Assign</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.assignee ? (
                    <div className="relative group/avatar" title={task.assignee.name}>
                      <div className="relative">
                        {task.assignee.avatar ? (
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className={`
                              w-8 h-8 rounded-full 
                              ring-2 ring-white dark:ring-gray-800
                              transition-transform duration-200
                              ${task.assignee.status === 'online' ? 'ring-green-400' : ''}
                            `}
                            loading="lazy"
                          />
                        ) : (
                          <div className={`
                            w-8 h-8 rounded-full 
                            bg-gradient-to-br from-gray-100 to-gray-200 
                            dark:from-gray-700 dark:to-gray-800
                            ring-2 ring-white dark:ring-gray-800
                            flex items-center justify-center
                            ${task.assignee.status === 'online' ? 'ring-green-400' : ''}
                          `}>
                            <FaUserCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        
                        {task.assignee.status === 'online' && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
                        )}
                      </div>

                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 
                        bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg
                        opacity-0 group-hover/avatar:opacity-100 
                        transition-opacity duration-200 pointer-events-none
                        whitespace-nowrap z-50"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium">{task.assignee.name}</span>
                          <span className="text-[10px] opacity-75">{task.assignee.role || 'Team Member'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                      No assignee
                    </div>
                  )}
                </div>

                {/* Assign Menu */}
                {showAssignMenu && (
                  <div className="absolute right-4 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {loading ? (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          Loading...
                        </div>
                      ) : (
                        <>
                          {/* Add your team members list here */}
                          <button
                            onClick={() => handleAssign('user1')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Team Member 1
                          </button>
                          <button
                            onClick={() => handleAssign('user2')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Team Member 2
                          </button>
                          {/* Add more team members as needed */}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Task Metadata */}
              <div className="flex items-center justify-between mt-3">
                {task.dueDate && (
                  <div className={`
                    flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs
                    ${new Date(task.dueDate) < new Date() ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400'}
                  `}>
                    <FaCalendar className="w-3.5 h-3.5" />
                    <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {task.commentsCount > 0 && (
                    <div className="flex items-center gap-1.5 bg-gray-100/50 dark:bg-gray-700/50 px-2 py-1 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                      <FaComment className="w-3.5 h-3.5" />
                      <span>{task.commentsCount}</span>
                    </div>
                  )}
                  {task.attachmentsCount > 0 && (
                    <div className="flex items-center gap-1.5 bg-gray-100/50 dark:bg-gray-700/50 px-2 py-1 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                      <FaPaperclip className="w-3.5 h-3.5" />
                      <span>{task.attachmentsCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <FaEllipsisH className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;