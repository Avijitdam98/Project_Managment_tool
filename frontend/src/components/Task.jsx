import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
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

const Task = ({ task, index, onEditTask }) => {
  const [isHovered, setIsHovered] = useState(false);
  const priorityColor = getPriorityColor(task.priority);
  const completedTasks = task.checklist?.filter(item => item.completed).length || 0;
  const totalTasks = task.checklist?.length || 0;

  const handleEdit = () => {
    onEditTask(task);
  };

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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleEdit}
        >
          {/* Priority Indicator */}
          <div className={`absolute top-0 left-0 w-full h-1 ${priorityColor}`} />

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

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-surface-500">
              {/* Due Date */}
              {task.dueDate && (
                <div className={`flex items-center gap-1.5 
                  ${new Date(task.dueDate) < new Date() ? 'text-error' : ''}`}
                >
                  <FaRegClock className="w-3.5 h-3.5" />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}

              {/* Comments Count */}
              {task.comments?.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <FaRegComment className="w-3.5 h-3.5" />
                  <span>{task.comments.length}</span>
                </div>
              )}

              {/* Checklist Progress */}
              {totalTasks > 0 && (
                <div className="flex items-center gap-1.5">
                  <FaRegCheckSquare className="w-3.5 h-3.5" />
                  <span>{completedTasks}/{totalTasks}</span>
                </div>
              )}
            </div>

            {/* Assignees */}
            {task.assignees?.length > 0 && (
              <div className="flex items-center gap-1 mt-3">
                {task.assignees.map((assignee, i) => (
                  <img
                    key={assignee._id || i}
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-6 h-6 rounded-full border-2 border-white 
                      hover:scale-110 transition-transform duration-300"
                    style={{ marginLeft: i > 0 ? '-0.5rem' : 0 }}
                    title={assignee.name}
                  />
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
              transition-opacity duration-300">
              <button 
                className="p-1.5 rounded-lg bg-surface-100/80 backdrop-blur-sm
                  hover:bg-surface-200/80 text-surface-500 hover:text-surface-700
                  transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add quick actions menu
                }}
              >
                <FaEllipsisH className="w-3.5 h-3.5" />
              </button>
            </div>
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
    dueDate: PropTypes.string,
    labels: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        color: PropTypes.string,
      })
    ),
    assignees: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string,
      })
    ),
    comments: PropTypes.array,
    attachments: PropTypes.array,
    checklist: PropTypes.arrayOf(
      PropTypes.shape({
        completed: PropTypes.bool,
      })
    ),
  }).isRequired,
  index: PropTypes.number.isRequired,
  onEditTask: PropTypes.func.isRequired,
};

export default Task;
