import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const TaskTimeline = ({ boards, showDetails = true }) => {
  // Get all tasks from all boards
  const allTasks = boards?.reduce((acc, board) => {
    const boardTasks = board.columns?.reduce((tasks, column) => {
      return tasks.concat(column.tasks?.map(task => ({
        ...task,
        boardTitle: board.title,
        columnTitle: column.title
      })) || []);
    }, []) || [];
    return acc.concat(boardTasks);
  }, []) || [];

  // Sort tasks by due date and limit to most recent
  // If it's a single board view, show more tasks
  const maxTasks = boards?.length === 1 ? 10 : 5;
  const recentTasks = allTasks
    .filter(task => task.dueDate)
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    .slice(0, maxTasks);

  const getStatusColor = (status, columnTitle) => {
    const title = columnTitle?.toLowerCase();
    if (status === 'completed' || title?.includes('done')) return 'success';
    if (status === 'inProgress' || title?.includes('progress')) return 'primary';
    if (status === 'blocked') return 'error';
    return 'grey';
  };

  const getStatusIcon = (status, columnTitle) => {
    const title = columnTitle?.toLowerCase();
    if (status === 'completed' || title?.includes('done')) return <FaCheckCircle />;
    if (status === 'blocked') return <FaExclamationCircle />;
    return <FaClock />;
  };

  if (!boards || boards.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No tasks available</p>
      </div>
    );
  }

  if (recentTasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No tasks with due dates found</p>
      </div>
    );
  }

  return (
    <div className="task-timeline bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <Timeline position="alternate">
        {recentTasks.map((task) => (
          <TimelineItem key={task._id}>
            <TimelineOppositeContent color="textSecondary">
              {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot color={getStatusColor(task.status, task.columnTitle)}>
                {getStatusIcon(task.status, task.columnTitle)}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            
            <TimelineContent>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                {boards.length > 1 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {task.boardTitle}
                  </div>
                )}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.columnTitle}
                  </span>
                </div>
                {showDetails && (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.description}
                    </p>
                    
                    {task.dependencies && task.dependencies.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Dependencies:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {task.dependencies.map((dep) => (
                            <span
                              key={dep._id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {dep.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {task.priority}
                      </span>
                      {task.estimatedTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Est: {task.estimatedTime}h
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default TaskTimeline;
