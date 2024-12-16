import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import PropTypes from 'prop-types';

const TaskColumn = ({ column, index }) => {
  return (
    <div className="glass-card min-w-[300px] max-w-[300px] flex flex-col rounded-xl">
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-surface-200/50">
        <div className="flex items-center gap-3">
          <span className="font-medium text-surface-700">{column.title}</span>
          <span className="badge-modern bg-surface-100 text-surface-600">
            {column.tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <Droppable droppableId={index.toString()}>
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
            {column.tasks.map((task, taskIndex) => (
              <TaskCard
                key={task._id}
                task={task}
                index={taskIndex}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
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
  index: PropTypes.number.isRequired,
};

export default TaskColumn;
