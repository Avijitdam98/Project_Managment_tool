
import PropTypes from 'prop-types';
import Card from './Card';

const Column = ({ title, tasks }) => {
  return (
    <div className="column">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <div className="space-y-2">
        {tasks.map(task => (
          <Card key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

Column.propTypes = {
  title: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      assignee: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default Column;