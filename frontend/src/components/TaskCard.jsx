import React from 'react';
import { format } from 'date-fns';
import { FaCalendar, FaFlag, FaUser, FaEllipsisH } from 'react-icons/fa';
import { Draggable } from '@hello-pangea/dnd';

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
};

const TaskCard = ({ task, index }) => {
  const priorityColor = priorityColors[task.priority] || priorityColors.medium;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-2
            border border-gray-200 dark:border-gray-700
            hover:shadow-md transition-shadow duration-200
            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''}
          `}
        >
          {/* Priority Indicator */}
          <div className="absolute top-0 right-0 mt-4 mr-4">
            <div className={`h-2 w-2 rounded-full ${priorityColor}`} />
          </div>

          {/* Task Title */}
          <h3 className="text-gray-900 dark:text-white font-medium mb-2 pr-6">
            {task.title}
          </h3>

          {/* Task Description */}
          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Task Metadata */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <FaCalendar className="mr-1 h-3 w-3" />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}

              {/* Priority */}
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <FaFlag className="mr-1 h-3 w-3" />
                <span className="capitalize">{task.priority}</span>
              </div>
            </div>

            {/* Assignees */}
            <div className="flex -space-x-2">
              {task.assignees?.map((assignee) => (
                <div
                  key={assignee._id}
                  className="relative"
                  title={assignee.name}
                >
                  {assignee.avatar ? (
                    <img
                      src={assignee.avatar}
                      alt={assignee.name}
                      className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-gray-800"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                      <FaUser className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions Menu - Visible on Hover */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FaEllipsisH className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
