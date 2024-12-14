import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { FaCheckCircle, FaClock, FaExclamationCircle, FaCalendarAlt, FaUserClock } from 'react-icons/fa';
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
      className="task-timeline bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg w-full max-w-6xl mx-auto overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Timeline position="alternate" sx={{
        padding: { xs: '6px', sm: '12px', md: '16px' },
        '& .MuiTimelineItem-root': {
          minHeight: '120px',
        },
        '& .MuiTimelineContent-root': {
          padding: '0 16px',
        },
        '& .MuiTimelineOppositeContent-root': {
          padding: '0 16px',
        }
      }}>
        {recentTasks.map((task, index) => (
          <motion.div
            key={task._id}
            variants={itemVariants}
            custom={index}
            className="w-full"
          >
            <TimelineItem>
              <TimelineOppositeContent>
                <motion.div 
                  className="flex flex-col items-end space-y-2 pr-2 sm:pr-4"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-2 text-sm sm:text-base">
                    <FaCalendarAlt className="text-gray-400 dark:text-gray-500 hidden sm:block" />
                    <span className="font-medium text-gray-600 dark:text-gray-300 truncate">
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                    </span>
                  </div>
                  {task.estimatedTime && (
                    <div className="flex items-center space-x-2 text-sm">
                      <FaUserClock className="text-gray-400 dark:text-gray-500 hidden sm:block" />
                      <span className="text-gray-500 dark:text-gray-400">
                        Est: {task.estimatedTime}h
                      </span>
                    </div>
                  )}
                </motion.div>
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <TimelineDot 
                    color={getStatusColor(task.status, task.columnTitle)}
                    className="cursor-pointer shadow-lg"
                    sx={{ 
                      width: { xs: '30px', sm: '40px' }, 
                      height: { xs: '30px', sm: '40px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '0.9rem', sm: '1.2rem' }
                    }}
                  >
                    {getStatusIcon(task.status, task.columnTitle)}
                  </TimelineDot>
                </motion.div>
                <TimelineConnector className="dark:bg-gray-600" sx={{ width: '2px' }} />
              </TimelineSeparator>
              
              <TimelineContent>
                <motion.div 
                  className={`${getCardColor(task.columnTitle)} p-3 sm:p-4 md:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden w-full`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {boards.length > 1 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {task.boardTitle}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                      {task.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${getStatusBadgeColor(task.columnTitle)} font-medium whitespace-nowrap`}>
                      {task.columnTitle}
                    </span>
                  </div>
                  
                  {showDetails && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {task.description}
                      </p>
                      
                      {task.dependencies && task.dependencies.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Dependencies:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {task.dependencies.map((dep) => (
                              <span
                                key={dep._id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 truncate max-w-[150px]"
                              >
                                {dep.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          Priority: {task.priority}
                        </span>
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
