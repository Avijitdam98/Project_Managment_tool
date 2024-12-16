import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  LuCalendar, 
  LuFlag, 
  LuUser, 
  LuMoreHorizontal, 
  LuPencil, 
  LuTrash2, 
  LuX, 
  LuCheck 
} from 'react-icons/lu';
import { FaLink, FaUnlink, FaExclamationTriangle, FaLock, FaLockOpen, FaArrowRight, FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import { Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoardDetails } from '../store/boardSlice';
import { toast } from 'react-toastify';
import api from '../utils/api';

const priorityColors = {
  low: {
    gradient: 'from-emerald-400 to-green-500',
    lightGradient: 'from-emerald-400/10 to-green-500/10',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-l-emerald-400',
    hover: 'hover:border-l-emerald-500'
  },
  medium: {
    gradient: 'from-amber-400 to-yellow-500',
    lightGradient: 'from-amber-400/10 to-yellow-500/10',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-l-amber-400',
    hover: 'hover:border-l-amber-500'
  },
  high: {
    gradient: 'from-rose-400 to-red-500',
    lightGradient: 'from-rose-400/10 to-red-500/10',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-l-rose-400',
    hover: 'hover:border-l-rose-500'
  }
};

const TaskCard = ({ task, index, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);
  const [dependencyType, setDependencyType] = useState('blocks');
  const [selectedDependency, setSelectedDependency] = useState('');
  const [availableTasks, setAvailableTasks] = useState([]);
  const [dependencies, setDependencies] = useState(task.dependencies || []);
  const [showDependencyList, setShowDependencyList] = useState(false);
  const dispatch = useDispatch();
  const board = useSelector(state => state.boards.currentBoard);
  const priorityColor = priorityColors[task.priority] || priorityColors.medium;

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) {
      onEdit(task);
    } else {
      console.warn('Edit function not implemented');
    }
  };

  const handleDelete = async (confirmed = false) => {
    if (confirmed) {
      try {
        const response = await api.delete(`/api/tasks/${task._id}`);
        if (response.status === 200) {
          dispatch(fetchBoardDetails(board._id));
          setShowMenu(false);
          setShowConfirm(false);
          toast.success('Task deleted successfully');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete task');
      }
    } else {
      setShowConfirm(true);
    }
  };

  const generateAvatarBackground = (name) => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-pink-500 to-rose-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-green-600',
      'from-amber-500 to-orange-600'
    ];
    const hash = name.charCodeAt(0) % colors.length;
    return colors[hash];
  };

  const getDependencyIcon = (type) => {
    switch (type) {
      case 'blocks':
        return <FaLock className="text-red-500" />;
      case 'blocked-by':
        return <FaLockOpen className="text-orange-500" />;
      case 'relates-to':
        return <FaLink className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getDependencyColor = (type) => {
    switch (type) {
      case 'blocks':
        return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10';
      case 'blocked-by':
        return 'border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'relates-to':
        return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10';
      default:
        return '';
    }
  };

  const getDependencyCounts = () => {
    const counts = {
      blocks: dependencies.filter(d => d.type === 'blocks').length,
      blockedBy: dependencies.filter(d => d.type === 'blocked-by').length,
      relatesTo: dependencies.filter(d => d.type === 'relates-to').length
    };
    return counts;
  };

  const renderDependencyBadges = () => {
    const counts = getDependencyCounts();
    return (
      <div className="flex gap-1">
        {counts.blocks > 0 && (
          <div
            key="badge-blocks"
            className="px-1.5 py-0.5 text-xs rounded bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
            title={`Blocks ${counts.blocks} ${counts.blocks === 1 ? 'task' : 'tasks'}`}
          >
            <FaArrowRight className="w-2.5 h-2.5 inline-block" /> {counts.blocks}
          </div>
        )}
        {counts.blockedBy > 0 && (
          <div
            key="badge-blocked-by"
            className="px-1.5 py-0.5 text-xs rounded bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
            title={`Blocked by ${counts.blockedBy} ${counts.blockedBy === 1 ? 'task' : 'tasks'}`}
          >
            <FaArrowLeft className="w-2.5 h-2.5 inline-block" /> {counts.blockedBy}
          </div>
        )}
        {counts.relatesTo > 0 && (
          <div
            key="badge-relates-to"
            className="px-1.5 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            title={`Related to ${counts.relatesTo} ${counts.relatesTo === 1 ? 'task' : 'tasks'}`}
          >
            <FaLink className="w-2.5 h-2.5 inline-block" /> {counts.relatesTo}
          </div>
        )}
      </div>
    );
  };

  const handleRemoveDependency = async (dependency) => {
    if (!dependency?._id) {
      console.error('Invalid dependency:', dependency);
      toast.error('Invalid dependency data');
      return;
    }

    // Handle both cases where task is a string ID or an object
    const dependencyTaskId = typeof dependency.task === 'string' 
      ? dependency.task 
      : dependency.task?._id;

    if (!dependencyTaskId) {
      console.error('Invalid task ID in dependency:', dependency);
      toast.error('Invalid dependency data');
      return;
    }

    try {
      const response = await api.delete(`/api/tasks/${task._id}/dependencies/${dependencyTaskId}`);
      
      if (response.data && response.data.dependencies) {
        // Update local state
        setDependencies(response.data.dependencies);
        
        // Update parent component
        if (onEdit) {
          onEdit({
            ...task,
            dependencies: response.data.dependencies
          });
        }
        toast.success('Dependency removed successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error removing dependency:', error);
      toast.error(
        error.response?.data?.error || 
        'Failed to remove dependency. Please try again.'
      );
    }
  };

  const handleAddDependency = async () => {
    if (!selectedDependency) return;
    
    try {
      const response = await api.post(`/api/tasks/${task._id}/dependencies`, {
        dependencyTaskId: selectedDependency,
        type: dependencyType
      });
      setDependencies(response.data.dependencies);
      // Update the task's dependencies in the parent component
      if (onEdit) {
        onEdit({ ...task, dependencies: response.data.dependencies });
      }
      toast.success('Dependency added successfully');
      setSelectedDependency('');
      setShowDependencies(false);
    } catch (error) {
      console.error('Error adding dependency:', error);
      toast.error(error.response?.data?.error || 'Failed to add dependency');
    }
  };

  useEffect(() => {
    if (showDependencies) {
      // Fetch available tasks for dependencies
      const fetchAvailableTasks = async () => {
        try {
          const response = await api.get(`/api/boards/${board._id}/tasks`);
          // Filter out the current task and transform the data
          const availableTasks = response.data
            .filter(t => t._id !== task._id)
            .map(t => ({
              _id: t._id,
              title: t.title,
              status: t.status
            }));
          setAvailableTasks(availableTasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
          toast.error('Failed to load available tasks');
        }
      };
      fetchAvailableTasks();
    }
  }, [showDependencies, board._id, task._id]);

  return (
    <Draggable draggableId={task._id} index={index} key={task._id}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1
          }}
          className={`
            relative
            bg-white dark:bg-gray-800 
            rounded-xl 
            p-4 
            shadow-md hover:shadow-lg
            border-l-4 ${priorityColor.border}
            border-t border-r border-b border-gray-100 dark:border-gray-700
            mb-3
            transform transition-all duration-300 ease-in-out
            hover:-translate-y-1 ${priorityColor.hover}
            ${snapshot.isDragging ? 'shadow-lg scale-[1.02] rotate-1' : ''}
            dark:shadow-gray-900/30
            overflow-hidden
          `}
        >
          {/* Background Gradient */}
          <div className={`
            absolute inset-0 
            bg-gradient-to-r ${priorityColor.lightGradient}
            opacity-50
            pointer-events-none
          `} />

          {/* Left Border Gradient Glow */}
          <div className={`
            absolute left-0 top-0 bottom-0
            w-1
            bg-gradient-to-b ${priorityColor.gradient}
            opacity-75
          `} />

          <div className="relative z-10">
            {/* Header with Modern Typography */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="
                font-bold text-xl 
                text-gray-900 dark:text-white 
                tracking-tight
              ">
                {task.title}
              </h3>

              {/* Overflow Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="
                    p-2 rounded-full 
                    hover:bg-gray-100/50 dark:hover:bg-gray-800/50 
                    transition-colors group
                  "
                >
                  <LuMoreHorizontal 
                    className="
                      w-5 h-5 
                      text-gray-500 
                      group-hover:text-gray-700 
                      dark:text-gray-400 
                      dark:group-hover:text-gray-200
                    " 
                  />
                </button>

                {/* Dropdown Menu with Floating Effect */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={showMenu ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    absolute right-0 mt-2 w-56 
                    bg-white dark:bg-gray-800 
                    rounded-2xl 
                    shadow-2xl border 
                    dark:border-gray-700 
                    overflow-hidden
                    z-50
                  `}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEdit}
                    className="
                      w-full px-4 py-3 
                      text-left flex items-center gap-3 
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      transition-colors
                    "
                  >
                    <LuPencil className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-200 text-sm">Edit Task</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete()}
                    className="
                      w-full px-4 py-3 
                      text-left flex items-center gap-3 
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      transition-colors
                    "
                  >
                    <LuTrash2 className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 dark:text-red-400 text-sm">Delete Task</span>
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Description with Ellipsis */}
            {task.description && (
              <p className="
                text-sm text-gray-600 dark:text-gray-300 
                mb-4 
                line-clamp-3 
                opacity-80
              ">
                {task.description}
              </p>
            )}

            {/* Enhanced Assignee Section */}
            {task.assignee && (
              <div className="flex items-center gap-3 mb-4">
                <div className={`
                  w-10 h-10 
                  rounded-full 
                  bg-gradient-to-br ${generateAvatarBackground(task.assignee.name)} 
                  flex items-center justify-center
                  ring-2 ring-white dark:ring-gray-800
                  shadow-md
                `}>
                  {task.assignee.avatar ? (
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="
                      text-sm font-bold 
                      text-white 
                      drop-shadow-md
                    ">
                      {task.assignee.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="
                  text-sm font-medium 
                  text-gray-700 dark:text-gray-200
                ">
                  {task.assignee.name}
                </span>
              </div>
            )}

            {/* Task Dependencies Button */}
            <button
              onClick={() => setShowDependencies(true)}
              className="
                p-2 rounded-full 
                hover:bg-gray-100/50 dark:hover:bg-gray-800/50 
                transition-colors group
                ml-auto
              "
            >
              <FaLink className="mr-1" />
              Dependencies
            </button>

            {dependencies?.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={() => setShowDependencyList(!showDependencyList)}
                  className="
                    w-full px-3 py-2 
                    flex items-center justify-between
                    text-sm font-medium
                    bg-gray-50 dark:bg-gray-800/50
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    rounded-lg transition-colors
                  "
                >
                  <div className="flex items-center gap-2">
                    <FaLink className="text-blue-500" />
                    <span>Dependencies</span>
                    <span className="
                      px-2 py-0.5 
                      text-xs 
                      bg-blue-100 dark:bg-blue-900/30 
                      text-blue-600 dark:text-blue-400
                      rounded-full
                    ">
                      {dependencies.length}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: showDependencyList ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronDown className="w-4 h-4 text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showDependencyList && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 space-y-3">
                        {/* Blocked Tasks */}
                        {dependencies.filter(dep => dep.type === 'blocks').length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-medium text-red-500 flex items-center gap-1">
                                <FaLock className="w-3 h-3" />
                                This Task
                              </div>
                              <div className="text-xs text-gray-500">blocks ↓</div>
                            </div>
                            {dependencies
                              .filter(dep => dep.type === 'blocks')
                              .map((dep, index) => (
                                <div
                                  key={`blocks-${dep._id || index}`}
                                  className="
                                    ml-4 p-2 rounded-lg
                                    bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/10
                                    border-l-2 border-red-500
                                    flex items-center gap-2
                                    group hover:bg-red-100/50 dark:hover:bg-red-900/20
                                    transition-colors
                                  "
                                >
                                  <FaArrowRight className="text-red-500 w-3 h-3" />
                                  <span className="text-sm flex-1">{dep.task.title}</span>
                                  <button
                                    onClick={() => handleRemoveDependency(dep)}
                                    className="
                                      p-1 rounded-full
                                      opacity-0 group-hover:opacity-100
                                      hover:bg-red-200 dark:hover:bg-red-900/50
                                      transition-all
                                    "
                                    title="Remove dependency"
                                  >
                                    <FaUnlink className="w-3 h-3 text-red-500" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Blocked By Tasks */}
                        {dependencies.filter(dep => dep.type === 'blocked-by').length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-medium text-orange-500 flex items-center gap-1">
                                <FaLockOpen className="w-3 h-3" />
                                This Task
                              </div>
                              <div className="text-xs text-gray-500">is blocked by ↓</div>
                            </div>
                            {dependencies
                              .filter(dep => dep.type === 'blocked-by')
                              .map((dep, index) => (
                                <div
                                  key={`blocked-by-${dep._id || index}`}
                                  className="
                                    ml-4 p-2 rounded-lg
                                    bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/10
                                    border-l-2 border-orange-500
                                    flex items-center gap-2
                                    group hover:bg-orange-100/50 dark:hover:bg-orange-900/20
                                    transition-colors
                                  "
                                >
                                  <FaArrowLeft className="text-orange-500 w-3 h-3" />
                                  <span className="text-sm flex-1">{dep.task.title}</span>
                                  <button
                                    onClick={() => handleRemoveDependency(dep)}
                                    className="
                                      p-1 rounded-full
                                      opacity-0 group-hover:opacity-100
                                      hover:bg-orange-200 dark:hover:bg-orange-900/50
                                      transition-all
                                    "
                                    title="Remove dependency"
                                  >
                                    <FaUnlink className="w-3 h-3 text-orange-500" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Related Tasks */}
                        {dependencies.filter(dep => dep.type === 'relates-to').length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-medium text-blue-500 flex items-center gap-1">
                                <FaLink className="w-3 h-3" />
                                This Task
                              </div>
                              <div className="text-xs text-gray-500">is related to ↓</div>
                            </div>
                            {dependencies
                              .filter(dep => dep.type === 'relates-to')
                              .map((dep, index) => (
                                <div
                                  key={`relates-to-${dep._id || index}`}
                                  className="
                                    ml-4 p-2 rounded-lg
                                    bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10
                                    border-l-2 border-blue-500
                                    flex items-center gap-2
                                    group hover:bg-blue-100/50 dark:hover:bg-blue-900/20
                                    transition-colors
                                  "
                                >
                                  <FaLink className="text-blue-500 w-3 h-3" />
                                  <span className="text-sm flex-1">{dep.task.title}</span>
                                  <button
                                    onClick={() => handleRemoveDependency(dep)}
                                    className="
                                      p-1 rounded-full
                                      opacity-0 group-hover:opacity-100
                                      hover:bg-blue-200 dark:hover:bg-blue-900/50
                                      transition-all
                                    "
                                    title="Remove dependency"
                                  >
                                    <FaUnlink className="w-3 h-3 text-blue-500" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Footer with Enhanced Styling */}
            <div className="flex items-center justify-between mt-5">
              {/* Priority Chip */}
              <div className={`
                inline-flex items-center gap-2 
                px-3 py-1.5 
                rounded-full 
                text-xs font-semibold 
                ${priorityColor.bg} ${priorityColor.text}
                shadow-sm
              `}>
                <LuFlag className="w-3.5 h-3.5" />
                <span className="capitalize">{task.priority}</span>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div className="
                  flex items-center gap-2 
                  text-xs 
                  text-gray-500 dark:text-gray-400
                  bg-gray-100/50 dark:bg-gray-800/50 
                  px-3 py-1.5 
                  rounded-full
                ">
                  <LuCalendar className="w-3.5 h-3.5" />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {renderDependencyBadges()}
            </div>
          </div>

          {/* Delete Confirmation */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div
                key="confirmModal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="
                  fixed inset-0 
                  bg-black/30 backdrop-blur-sm 
                  z-[100] 
                  flex items-center justify-center
                "
              >
                <div className="
                  bg-white dark:bg-gray-800 
                  rounded-3xl 
                  p-7 
                  shadow-2xl 
                  border dark:border-gray-700 
                  w-full max-w-md
                  relative
                ">
                  <h3 className="
                    text-xl font-bold 
                    text-gray-900 dark:text-gray-100 
                    mb-4
                  ">
                    Confirm Delete
                  </h3>
                  <p className="
                    text-gray-600 dark:text-gray-300 
                    mb-6 
                    text-sm
                  ">
                    Are you sure you want to delete this task?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="
                        px-4 py-2 
                        rounded-lg 
                        text-gray-600 dark:text-gray-300 
                        hover:bg-gray-100 dark:hover:bg-gray-700 
                        transition-colors
                      "
                    >
                      <LuX className="w-4 h-4 mr-2 inline-block" />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(true)}
                      className="
                        px-4 py-2 
                        rounded-lg 
                        bg-red-500 hover:bg-red-600 
                        text-white 
                        transition-colors
                        shadow-md hover:shadow-lg
                      "
                    >
                      <LuCheck className="w-4 h-4 mr-2 inline-block" />
                      Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dependencies Dialog */}
          {showDependencies && (
            <div
              className="
                fixed inset-0 
                bg-black/30 backdrop-blur-sm 
                z-[100] 
                flex items-center justify-center
              "
            >
              <div className="
                bg-white dark:bg-gray-800 
                rounded-3xl 
                p-7 
                shadow-2xl 
                border dark:border-gray-700 
                w-full max-w-md
                relative
              ">
                <h3 className="
                  text-xl font-bold 
                  text-gray-900 dark:text-gray-100 
                  mb-4
                ">
                  Task Dependencies
                </h3>
                
                <div className="space-y-4">
                  {/* Existing Dependencies */}
                  {dependencies?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Current Dependencies:</h4>
                      {dependencies.map((dep, index) => {
                        if (!dep.task || !dep.task._id) return null;
                        
                        return (
                          <div 
                            key={`dep-${dep.task._id || index}`} 
                            className={`
                              flex items-center justify-between p-3 rounded-lg
                              ${getDependencyColor(dep.type)}
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              {getDependencyIcon(dep.type)}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {dep.type === 'blocks' && 'This task blocks:'}
                                  {dep.type === 'blocked-by' && 'This task is blocked by:'}
                                  {dep.type === 'relates-to' && 'Related to:'}
                                </span>
                                <span className="text-sm">{dep.task.title}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveDependency(dep)}
                              className="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors group"
                            >
                              <FaUnlink className="text-red-500" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add New Dependency */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Add Dependency:</h4>
                    <div className="flex flex-col space-y-2">
                      <select
                        value={dependencyType}
                        onChange={(e) => setDependencyType(e.target.value)}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
                      >
                        <option value="blocks">This task blocks...</option>
                        <option value="blocked-by">This task is blocked by...</option>
                        <option value="relates-to">This task relates to...</option>
                      </select>

                      <select
                        value={selectedDependency}
                        onChange={(e) => setSelectedDependency(e.target.value)}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
                      >
                        <option value="">Select a task...</option>
                        {availableTasks.map((t) => (
                          <option key={`task-${t._id}`} value={t._id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => setShowDependencies(false)}
                      className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddDependency}
                      disabled={!selectedDependency}
                      className={`
                        px-4 py-2 rounded-lg 
                        ${selectedDependency 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                        transition-colors
                      `}
                    >
                      Add Dependency
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </Draggable>
  );
};

export default TaskCard;
