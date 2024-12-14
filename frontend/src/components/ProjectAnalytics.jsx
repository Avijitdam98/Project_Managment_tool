import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const defaultAnalyticsData = {
  tasksByStatus: {
    todo: 0,
    inProgress: 0,
    done: 0,
    blocked: 0,
  },
  tasksByPriority: {
    high: 0,
    medium: 0,
    low: 0,
  },
  tasksByColumn: {},
  columnTitles: [],
  totalTasks: 0,
  activeUsers: 0,
  averageTaskCompletion: 0,
  tasksDueSoon: 0,
  tasksWithDependencies: 0,
  timeAccuracy: 0,
  recentActivity: {
    completed: 0,
    inProgress: 0,
    blocked: 0
  }
};

const getColumnColor = (columnTitle) => {
  const title = columnTitle.toLowerCase();
  if (title.includes('todo') || title.includes('backlog')) return 'rgba(255, 206, 86, 0.7)';
  if (title.includes('progress')) return 'rgba(54, 162, 235, 0.7)';
  if (title.includes('done') || title.includes('completed')) return 'rgba(75, 192, 192, 0.7)';
  if (title.includes('blocked')) return 'rgba(255, 99, 132, 0.7)';
  return 'rgba(153, 102, 255, 0.7)';
};

const ProjectAnalytics = ({ projectId }) => {
  const [analyticsData, setAnalyticsData] = useState(defaultAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!projectId) {
        setLoading(false);
        setAnalyticsData(defaultAnalyticsData);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching analytics for project:', projectId);
        const response = await axios.get(`/api/boards/${projectId}/analytics`);
        console.log('Analytics response:', response.data);
        
        // Ensure all required fields exist
        const data = {
          ...defaultAnalyticsData,
          ...response.data,
          tasksByStatus: {
            ...defaultAnalyticsData.tasksByStatus,
            ...(response.data.tasksByStatus || {})
          },
          tasksByPriority: {
            ...defaultAnalyticsData.tasksByPriority,
            ...(response.data.tasksByPriority || {})
          },
          tasksByColumn: response.data.tasksByColumn || {},
          columnTitles: response.data.columnTitles || [],
          recentActivity: {
            ...defaultAnalyticsData.recentActivity,
            ...(response.data.recentActivity || {})
          }
        };
        
        console.log('Processed analytics data:', data);
        setAnalyticsData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalyticsData(defaultAnalyticsData);
        setError(error.response?.data?.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="text-red-500 dark:text-red-400">
          <p>{error}</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  // Create dynamic column data
  const columnData = {
    labels: analyticsData.columnTitles,
    datasets: [
      {
        data: analyticsData.columnTitles.map(title => analyticsData.tasksByColumn[title] || 0),
        backgroundColor: analyticsData.columnTitles.map(title => getColumnColor(title)),
        borderWidth: 1,
      },
    ],
  };

  const taskPriorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [
          analyticsData.tasksByPriority.high,
          analyticsData.tasksByPriority.medium,
          analyticsData.tasksByPriority.low,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
      },
    ],
  };

  const completionRate = analyticsData.totalTasks > 0
    ? ((analyticsData.tasksByStatus.done / analyticsData.totalTasks) * 100).toFixed(1)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Project Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Task Status Distribution</h3>
          <div className="h-64">
            <Pie 
              data={columnData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tasks by Priority</h3>
          <div className="h-64">
            <Bar
              data={taskPriorityData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                    },
                    grid: {
                      color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                  },
                  x: {
                    ticks: {
                      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                    },
                    grid: {
                      color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Project Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg shadow">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.totalTasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Tasks</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg shadow">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completionRate}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg shadow">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{analyticsData.tasksDueSoon}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Due Soon</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg shadow">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {analyticsData.averageTaskCompletion?.toFixed(1) || 0} days
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Avg. Completion Time</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg shadow">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{analyticsData.tasksWithDependencies}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tasks with Dependencies</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg shadow">
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{analyticsData.timeAccuracy}x</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Time Estimation Accuracy</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg shadow">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analyticsData.activeUsers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Team Members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
