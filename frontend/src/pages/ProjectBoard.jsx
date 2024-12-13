import  { useEffect, useState } from 'react';
import { fetchTasks, fetchColumns } from '../services/api';
import Column from '../components/Column';
import Notifications from '../components/Notifications';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const ProjectBoard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getColumns = async () => {
      try {
        const data = await fetchColumns();
        setColumns(data);
      } catch (err) {
        setError('Failed to fetch columns');
        addNotification({ id: Date.now(), message: 'Failed to fetch columns' });
      } finally {
        setLoading(false);
      }
    };
    getColumns();
  }, []);

  if (loading) return <div>Loading project board...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="project-board">
      <Notifications />
      <h1 className="text-2xl font-bold mb-4">Project Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(column => (
          <Column key={column._id} title={column.title} tasks={column.tasks} />
        ))}
      </div>
    </div>
  );
};

export default ProjectBoard;