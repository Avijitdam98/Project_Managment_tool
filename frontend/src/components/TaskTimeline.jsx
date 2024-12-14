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
import { motion } from 'framer-motion';

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
    return 'warning'; // for Todo
  };

  const getCardColor = (columnTitle) => {
    const title = columnTitle?.toLowerCase();
    if (title?.includes('done')) {
      return 'bg-green-50 dark:bg-green-900/20';
    }
    if (title?.includes('progress')) {
      return 'bg-blue-50 dark:bg-blue-900/20';
    }
    if (title?.includes('todo')) {
      return 'bg-yellow-50 dark:bg-yellow-900/20';
    }
    return 'bg-gray-50 dark:bg-gray-700';
  };

  const getStatusBadgeColor = (columnTitle) => {
    const title = columnTitle?.toLowerCase();
    if (title?.includes('done')) {
      return 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100';
    }
    if (title?.includes('progress')) {
      return 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100';
    }
    if (title?.includes('todo')) {
      return 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100';
    }
    return 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300';
  };

  const getStatusIcon = (status, columnTitle) => {
    const title = columnTitle?.toLowerCase();
    if (status === 'completed' || title?.includes('done')) return <FaCheckCircle />;
    if (status === 'blocked') return <FaExclamationCircle />;
    return <FaClock />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  if (!boards || boards.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-48 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <p className="text-gray-500 dark:text-gray-300">No tasks available</p>
      </motion.div>
    );
  }

  if (recentTasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-48 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <p className="text-gray-500 dark:text-gray-300">No tasks with due dates found</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="task-timeline bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Timeline position="alternate">
        {recentTasks.map((task, index) => (
          <motion.div
            key={task._id}
            variants={itemVariants}
            custom={index}
          >
            <TimelineItem>
              <TimelineOppositeContent className="dark:text-gray-300">
                {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <TimelineDot 
                    color={getStatusColor(task.status, task.columnTitle)}
                    className="cursor-pointer"
                  >
                    {getStatusIcon(task.status, task.columnTitle)}
                  </TimelineDot>
                </motion.div>
                <TimelineConnector className="dark:bg-gray-600" />
              </TimelineSeparator>
              
              <TimelineContent>
                <motion.div 
                  className={`${getCardColor(task.columnTitle)} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {boards.length > 1 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {task.boardTitle}
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(task.columnTitle)}`}>
                      {task.columnTitle}
                    </span>
                  </div>
                  {showDetails && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
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
                        <span className={`inline-flex items-center px-2 py-1 rounded-full ${
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
                    </div>
                  )}
                </motion.div>
              </TimelineContent>
            </TimelineItem>
          </motion.div>
        ))}
      </Timeline>
    </motion.div>
  );
};

export default TaskTimeline;
