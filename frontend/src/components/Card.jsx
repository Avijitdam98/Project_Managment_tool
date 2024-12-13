
import PropTypes from 'prop-types';

const Card = ({ task }) => {
  return (
    <div className="card">
      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
      {task.description && <p className="text-sm text-gray-600 mb-3">{task.description}</p>}
      {task.assignee && (
        <div className="flex items-center">
          <img
            src={
              task.assignee.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name)}`
            }
            alt={task.assignee.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="ml-2 text-sm text-gray-600">{task.assignee.name}</span>
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    assignee: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }),
  }).isRequired,
};

export default Card;