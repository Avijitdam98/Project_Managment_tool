import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import PropTypes from 'prop-types';
import { FaRegClock, FaRegComment, FaRegCheckSquare, FaEllipsisH } from 'react-icons/fa';
import { format } from 'date-fns';

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-gradient-to-r from-red-500/80 to-rose-500/80';
    case 'medium':
      return 'bg-gradient-to-r from-amber-500/80 to-yellow-500/80';
    case 'low':
      return 'bg-gradient-to-r from-emerald-500/80 to-green-500/80';
    default:
      return 'bg-gradient-to-r from-surface-400/80 to-surface-500/80';
  }
};

const Task = ({ task, index, columnId }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card-modern group relative overflow-hidden
            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500/20' : ''}
            hover:scale-[1.02] active:scale-[0.98] cursor-grab active:cursor-grabbing
            transition-all duration-300`}
        >
          {/* Priority Indicator */}
          <div className={`absolute top-0 left-0 w-full h-1 ${getPriorityColor(task.priority)}`} />

          {/* Card Content */}
          <div className="p-4">
            {/* Title */}
            <h3 className="font-medium text-surface-800 mb-2 line-clamp-2">
              {task.title}
            </h3>

            {/* Description Preview */}
            {task.description && (
              <p className="text-sm text-surface-600 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  columnId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};

export default Task;
