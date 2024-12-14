import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBoards, createBoard } from '../store/boardSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, isAfter } from 'date-fns';
import {
  FaChartLine,
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaPlus,
  FaSearch,
  FaStar,
  FaClock,
  FaFilter,
  FaSort,
  FaBell,
  FaCalendar,
  FaChartBar,
  FaUserFriends,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import BoardCard from '../components/BoardCard';
import CreateBoardModal from '../components/CreateBoardModal';
import TaskTimeline from '../components/TaskTimeline';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boards, loading } = useSelector((state) => state.boards);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(fetchBoards());
    }
  }, [user, dispatch, navigate]);

  // Calculate statistics and analytics
  const stats = {
    totalBoards: boards?.length || 0,
    activeTasks: boards?.reduce((acc, board) => {
      return acc + board.columns?.reduce((taskAcc, col) => taskAcc + (col.tasks?.length || 0), 0);
    }, 0) || 0,
    completedTasks: boards?.reduce((acc, board) => {
      const doneColumn = board.columns?.find(col => 
        col.title.toLowerCase().includes('done')
      );
      return acc + (doneColumn?.tasks?.length || 0);
    }, 0) || 0,
    teamMembers: new Set(boards?.flatMap(board => board.members?.map(m => m._id))).size || 0,
    upcomingDeadlines: boards?.reduce((acc, board) => {
      const tasks = board.columns?.flatMap(col => col.tasks || []) || [];
      return acc + tasks.filter(task => {
        const deadline = new Date(task.dueDate);
        return isAfter(deadline, new Date()) && isAfter(subDays(deadline, 7), new Date());
      }).length;
    }, 0) || 0,
    overdueTasks: boards?.reduce((acc, board) => {
      const tasks = board.columns?.flatMap(col => col.tasks || []) || [];
      return acc + tasks.filter(task => {
        const deadline = new Date(task.dueDate);
        return isAfter(new Date(), deadline);
      }).length;
    }, 0) || 0
  };

  // Calculate activity data for charts
  const getActivityData = () => {
    const days = selectedTimeRange === 'week' ? 7 : 30;
    const dates = Array.from({ length: days }, (_, i) => subDays(new Date(), i));
    const activityData = dates.reduce((acc, date) => {
      const dayStr = format(date, 'MMM dd');
      acc[dayStr] = {
        tasks: 0,
        completed: 0
      };
      return acc;
    }, {});

    boards?.forEach(board => {
      board.columns?.forEach(column => {
        column.tasks?.forEach(task => {
          const taskDate = format(new Date(task.createdAt), 'MMM dd');
          if (activityData[taskDate]) {
            activityData[taskDate].tasks++;
            if (column.title.toLowerCase().includes('done')) {
              activityData[taskDate].completed++;
            }
          }
        });
      });
    });

    return {
      labels: Object.keys(activityData).reverse(),
      datasets: [
        {
          label: 'Tasks Created',
          data: Object.values(activityData).map(d => d.tasks).reverse(),
          borderColor: '#3B82F6',
          tension: 0.4
        },
        {
          label: 'Tasks Completed',
          data: Object.values(activityData).map(d => d.completed).reverse(),
          borderColor: '#10B981',
          tension: 0.4
        }
      ]
    };
  };

  // Get priority tasks
  const getPriorityTasks = () => {
    const allTasks = boards?.flatMap(board => 
      board.columns?.flatMap(col => 
        (col.tasks || []).map(task => ({
          ...task,
          boardTitle: board.title,
          columnTitle: col.title
        }))
      ) || []
    ) || [];

    return allTasks
      .filter(task => task.priority === 'high')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  // Get team activity
  const getTeamActivity = () => {
    const teamActivity = [];
    boards?.forEach(board => {
      board.columns?.forEach(column => {
        column.tasks?.forEach(task => {
          if (task.assignee) {
            teamActivity.push({
              user: task.assignee,
              action: 'assigned to',
              task: task.title,
              board: board.title,
              date: task.updatedAt
            });
          }
          if (task.comments?.length > 0) {
            task.comments.forEach(comment => {
              teamActivity.push({
                user: comment.user,
                action: 'commented on',
                task: task.title,
                board: board.title,
                date: comment.createdAt
              });
            });
          }
        });
      });
    });

    return teamActivity
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Project Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name}! Here's your project overview.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setSelectedTimeRange(selectedTimeRange === 'week' ? 'month' : 'week')}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FaCalendar className="inline-block mr-2" />
              {selectedTimeRange === 'week' ? 'Last Week' : 'Last Month'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <FaPlus className="inline-block mr-2" />
              New Board
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Boards</p>
                <h3 className="text-2xl font-bold">{stats.totalBoards}</h3>
              </div>
              <FaChartLine className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Tasks</p>
                <h3 className="text-2xl font-bold">{stats.activeTasks}</h3>
              </div>
              <FaTasks className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Completed</p>
                <h3 className="text-2xl font-bold">{stats.completedTasks}</h3>
              </div>
              <FaCheckCircle className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Team Members</p>
                <h3 className="text-2xl font-bold">{stats.teamMembers}</h3>
              </div>
              <FaUserFriends className="w-8 h-8 text-yellow-200" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100">Upcoming</p>
                <h3 className="text-2xl font-bold">{stats.upcomingDeadlines}</h3>
              </div>
              <FaBell className="w-8 h-8 text-indigo-200" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Overdue</p>
                <h3 className="text-2xl font-bold">{stats.overdueTasks}</h3>
              </div>
              <FaExclamationTriangle className="w-8 h-8 text-red-200" />
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Overview</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedTimeRange('week')}
                  className={`px-3 py-1 rounded-lg ${
                    selectedTimeRange === 'week'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setSelectedTimeRange('month')}
                  className={`px-3 py-1 rounded-lg ${
                    selectedTimeRange === 'month'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
            <div className="h-[300px]">
              <Line data={getActivityData()} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }} />
            </div>
          </div>

          {/* Priority Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Priority Tasks</h2>
            <div className="space-y-4">
              {getPriorityTasks().map((task) => (
                <div
                  key={task._id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {task.boardTitle} • {task.columnTitle}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      High Priority
                    </span>
                  </div>
                  {task.dueDate && (
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <FaCalendar className="inline-block mr-1" />
                      Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Activity */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Team Activity</h2>
          <div className="space-y-4">
            {getTeamActivity().map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {activity.user.name?.[0] || 'U'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.user.name} {activity.action} "{activity.task}"
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    in {activity.board} • {format(new Date(activity.date), 'MMM dd, HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Board Modal */}
        {isModalOpen && (
          <CreateBoardModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateBoard}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;