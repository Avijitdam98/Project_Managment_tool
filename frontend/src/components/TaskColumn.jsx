import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Task from './Task';
import { FaPlus, FaEllipsisH } from 'react-icons/fa';
import PropTypes from 'prop-types';

const TaskColumn = ({ column, boardId, onEditTask }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const handleTitleSave = () => {
    // TODO: Implement title update
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="glass-card min-w-[300px] max-w-[300px] flex flex-col rounded-xl">
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-surface-200/50">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleKeyDown}
            className="input-modern py-1 text-sm"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-medium text-surface-700">{column.title}</span>
            <span className="badge-modern bg-surface-100 text-surface-600">
              {column.tasks.length}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn-modern p-1.5 text-surface-400 hover:text-surface-600"
          >
            <FaEllipsisH className="w-3.5 h-3.5" />
          </button>
          {showMenu && (
            <div className="dropdown-modern">
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-100/80
                    transition-colors duration-300"
                  onClick={() => {
                    setShowMenu(false);
                    setIsEditing(true);
                  }}
                >
                  Rename
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-100/80
                    transition-colors duration-300"
                  onClick={() => {
                    setShowMenu(false);
                    // TODO: Implement move column
                  }}
                >
                  Move Column
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-surface-100/80
                    transition-colors duration-300"
                  onClick={() => {
                    setShowMenu(false);
                    // TODO: Implement delete column
                  }}
                >
                  Delete Column
                </button>
              </div>
            </div>
          )}
          <button className="btn-modern p-1.5 text-surface-400 hover:text-surface-600">
            <FaPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tasks Container */}
      <Droppable droppableId={column._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-16rem)] 
              ${snapshot.isDraggingOver ? 'bg-primary-50/50' : ''}
              transition-colors duration-200
            `}
          >
            {column.tasks.map((task, index) => (
              <Task
                key={task._id}
                task={task}
                index={index}
                columnId={column._id}
                boardId={boardId}
                onEditTask={onEditTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Column Footer */}
      <div className="p-3 border-t border-surface-200/50">
        <button 
          className="w-full btn-modern bg-surface-100/50 hover:bg-surface-200/50 
            text-surface-500 hover:text-surface-700 flex items-center justify-center gap-2"
        >
          <FaPlus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};

TaskColumn.propTypes = {
  column: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  boardId: PropTypes.string.isRequired,
  onEditTask: PropTypes.func.isRequired,
};

export default TaskColumn;
