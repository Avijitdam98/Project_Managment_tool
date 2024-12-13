import { useEffect, useState } from 'react';
import { fetchTasks } from '../services/api';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks();
        setNotifications(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch notifications');
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, []);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="notifications">
      <h2 className="text-lg font-bold">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map(notification => (
          <li key={notification._id} className="bg-white p-3 rounded shadow">
            <p>{notification.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;