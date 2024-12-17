import React, { useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { FaCheckCircle, FaClock, FaExclamationCircle, FaCalendarAlt, FaUserClock, FaProjectDiagram, FaStream } from 'react-icons/fa';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import GanttChart from './GanttChart';

const TaskTimeline = ({ boards, showDetails = true }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
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
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const dotVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    hover: { 
      scale: 1.2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Helper functions
  const getStatusColor = (status, columnTitle) => {
    const title = columnTitle?.toLowerCase();
    if (status === 'completed' || title?.includes('done')) return 'success';
    if (status === 'inProgress' || title?.includes('progress')) return 'primary';
    if (status === 'blocked') return 'error';
    return 'warning';
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

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-200',
          icon: <FaExclamationCircle className="w-4 h-4 mr-1" />
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: <FaClock className="w-4 h-4 mr-1" />
        };
      default:
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-200',
          icon: <FaCheckCircle className="w-4 h-4 mr-1" />
        };
    }
  };

  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'gantt'

  // Get all tasks from all boards with unique IDs
  const allTasks = boards?.reduce((acc, board) => {
    const boardTasks = board.columns?.reduce((tasks, column) => {
      return tasks.concat(column.tasks?.map(task => ({
        ...task,
        uniqueId: `${board._id}-${column._id}-${task._id}`,
        boardTitle: board.title,
        columnTitle: column.title
      })) || []);
    }, []) || [];
    return acc.concat(boardTasks);
  }, []) || [];

  const maxTasks = boards?.length === 1 ? 10 : 5;
  const recentTasks = allTasks
    .filter(task => task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, maxTasks);

  if (recentTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <FaCalendarAlt className="mx-auto h-16 w-16 mb-4 text-gray-400 dark:text-gray-500" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
        >
          No tasks with due dates found
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto"
        >
          Add due dates to your tasks to see them in the timeline view
        </motion.p>
      </motion.div>
    );
  }

  const processedTasks = allTasks.map(task => ({
    ...task,
    startDate: task.startDate || new Date(),
    dueDate: task.dueDate || new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    status: task.columnTitle?.toLowerCase().includes('done') ? 'completed' : 
           task.columnTitle?.toLowerCase().includes('progress') ? 'inProgress' : 'todo'
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* View Toggle */}
      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={() => setViewMode('timeline')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            viewMode === 'timeline'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          <FaStream className="w-4 h-4" />
          <span>Timeline</span>
        </button>
        <button
          onClick={() => setViewMode('gantt')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            viewMode === 'gantt'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          <FaProjectDiagram className="w-4 h-4" />
          <span>Gantt</span>
        </button>
      </div>

      {viewMode === 'gantt' ? (
        <GanttChart tasks={processedTasks} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <Timeline position="right" className="px-4">
            {recentTasks.map((task, index) => (
              <TimelineItem key={task.uniqueId}>
                <TimelineOppositeContent className="py-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-end"
                  >
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </span>
                    {showDetails && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs text-gray-500 dark:text-gray-500 mt-1"
                      >
                        {task.boardTitle}
                      </motion.span>
                    )}
                  </motion.div>
                </TimelineOppositeContent>
                
                <TimelineSeparator>
                  <motion.div
                    variants={dotVariants}
                    whileHover="hover"
                  >
                    <TimelineDot 
                      color={getStatusColor(task.status, task.columnTitle)}
                      className="timeline-dot cursor-pointer"
                    >
                      {task.columnTitle?.toLowerCase().includes('done') ? (
                        <FaCheckCircle className="h-5 w-5" />
                      ) : (
                        <FaClock className="h-5 w-5" />
                      )}
                    </TimelineDot>
                  </motion.div>
                  {index < recentTasks.length - 1 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <TimelineConnector />
                    </motion.div>
                  )}
                </TimelineSeparator>

                <TimelineContent className="py-6">
                  <motion.div 
                    variants={cardVariants}
                    whileHover="hover"
                    className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${getCardColor(task.columnTitle)} border border-gray-100 dark:border-gray-700 backdrop-blur-sm relative overflow-hidden`}
                  >
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 dark:to-transparent pointer-events-none" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {task.title}
                        </h3>
                        {task.priority && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority).bg} ${getPriorityBadge(task.priority).text}`}
                          >
                            {getPriorityBadge(task.priority).icon}
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </motion.div>
                        )}
                      </div>
                      
                      {showDetails && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-4"
                        >
                          {task.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-3 pt-3">
                            {/* Column Badge */}
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-xs font-medium text-gray-700 dark:text-gray-300"
                            >
                              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: task.color || '#9CA3AF' }} />
                              {task.columnTitle}
                            </motion.div>
                            
                            {/* Assignee Badge */}
                            {task.assignee && (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-800 dark:text-blue-200"
                              >
                                <FaUserClock className="mr-1.5 w-3.5 h-3.5" />
                                {task.assignee.name}
                              </motion.div>
                            )}
                          </div>

                          {/* Checklist Progress if exists */}
                          {task.checklist && task.checklist.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="pt-3"
                            >
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                <span>Checklist Progress</span>
                                <span>
                                  {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: `${(task.checklist.filter(item => item.completed).length / task.checklist.length) * 100}%` 
                                  }}
                                  transition={{ duration: 0.5, delay: 0.4 }}
                                  className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                                />
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskTimeline;