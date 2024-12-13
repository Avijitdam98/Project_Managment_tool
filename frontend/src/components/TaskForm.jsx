import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../store/boardSlice';
import { addNotification } from '../store/notificationSlice';
import { fetchUsers } from '../store/userSlice';
import DatePicker from 'react-datepicker';
import { FaTimes, FaCalendar, FaFlag, FaUser, FaTags, FaPaperclip, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' }
];

const labels = [
  { value: 'bug', label: 'Bug', color: 'bg-red-200 dark:bg-red-900' },
  { value: 'feature', label: 'Feature', color: 'bg-blue-200 dark:bg-blue-900' },
  { value: 'enhancement', label: 'Enhancement', color: 'bg-purple-200 dark:bg-purple-900' },
  { value: 'documentation', label: 'Documentation', color: 'bg-gray-200 dark:bg-gray-700' }
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -5, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    y: -5, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring",
      duration: 0.5,
      bounce: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { duration: 0.3 }
  }
};

const TaskForm = ({ boardId, columnId, onClose }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.list || []);
  const [loading, setLoading] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null,
    priority: 'medium',
    assignee: null,
    labels: [],
    checklist: []
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate?.toISOString(),
        priority: formData.priority,
        assignee: formData.assignee?._id,
        labels: formData.labels.map(label => ({
          value: label.value,
          label: label.label,
          color: label.color
        })),
        checklist: formData.checklist.map(item => ({
          text: item.text,
          completed: item.completed
        }))
      };

      const result = await dispatch(addTask({
        boardId,
        columnId,
        taskData
      })).unwrap();

      if (formData.assignee) {
        dispatch(addNotification({
          type: 'task_assigned',
          message: `You were assigned to task "${formData.title}"`,
          userId: formData.assignee._id,
          taskId: result._id,
          boardId
        }));
      }

      toast.success('Task created successfully');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChecklist = () => {
    setFormData({
      ...formData,
      checklist: [...formData.checklist, { text: '', completed: false }]
    });
  };

  const handleChecklistChange = (index, text) => {
    const newChecklist = [...formData.checklist];
    newChecklist[index].text = text;
    setFormData({ ...formData, checklist: newChecklist });
  };

  const handleToggleChecklistItem = (index) => {
    const newChecklist = [...formData.checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    setFormData({ ...formData, checklist: newChecklist });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          variants={formVariants}
          className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl my-8 shadow-2xl transform transition-all"
        >
          <div className="max-h-[85vh] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 flex justify-between items-center z-10 backdrop-blur-md bg-opacity-90">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  Create New Task
                </motion.h2>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="px-6 py-6 space-y-8">
                {/* Title */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:placeholder-gray-500 transition-colors"
                    placeholder="Enter task title"
                  />
                </motion.div>

                {/* Description */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:placeholder-gray-500 resize-none transition-colors"
                    placeholder="Enter task description"
                  />
                </motion.div>

                {/* Priority and Due Date */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 appearance-none transition-colors"
                      >
                        {priorities.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                      <FaFlag className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Due Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={formData.dueDate}
                        onChange={(date) => setFormData({ ...formData, dueDate: date })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:placeholder-gray-500 transition-colors"
                        placeholderText="Select due date"
                        minDate={new Date()}
                        dateFormat="MMM d, yyyy"
                      />
                      <FaCalendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </motion.div>

                {/* Assignee */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Assignee
                  </label>
                  <div className="relative">
                    <motion.button
                      type="button"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 text-left flex items-center justify-between transition-colors"
                    >
                      <span>{formData.assignee?.name || 'Select assignee'}</span>
                      <FaUser className="text-gray-400 dark:text-gray-500" />
                    </motion.button>
                    <AnimatePresence>
                      {showUserDropdown && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto"
                        >
                          {users.length > 0 ? (
                            users.map((user) => (
                              <motion.button
                                key={user._id}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, assignee: user });
                                  setShowUserDropdown(false);
                                }}
                                whileHover={{ backgroundColor: '#f3f4f6', scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                              >
                                {user.name}
                              </motion.button>
                            ))
                          ) : (
                            <div className="px-4 py-2.5 text-gray-500 dark:text-gray-400">
                              No users available
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Labels */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Labels
                  </label>
                  <div className="relative">
                    <motion.button
                      type="button"
                      onClick={() => setShowLabelDropdown(!showLabelDropdown)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 text-left flex items-center justify-between transition-colors"
                    >
                      <div className="flex flex-wrap gap-2">
                        {formData.labels.length > 0 ? (
                          formData.labels.map((label) => (
                            <span
                              key={label.value}
                              className={`${label.color} px-2.5 py-1 rounded-full text-xs font-medium`}
                            >
                              {label.label}
                            </span>
                          ))
                        ) : (
                          <span>Select labels</span>
                        )}
                      </div>
                      <FaTags className="text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0" />
                    </motion.button>
                    <AnimatePresence>
                      {showLabelDropdown && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl"
                        >
                          {labels.map((label) => (
                            <motion.button
                              key={label.value}
                              type="button"
                              onClick={() => {
                                const newLabels = formData.labels.some(l => l.value === label.value)
                                  ? formData.labels.filter((l) => l.value !== label.value)
                                  : [...formData.labels, label];
                                setFormData({ ...formData, labels: newLabels });
                              }}
                              whileHover={{ backgroundColor: '#f3f4f6', scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100 flex items-center justify-between transition-colors first:rounded-t-lg last:rounded-b-lg"
                            >
                              <span className={`${label.color} px-2.5 py-1 rounded-full text-xs font-medium`}>
                                {label.label}
                              </span>
                              {formData.labels.some(l => l.value === label.value) && (
                                <FaCheckCircle className="text-green-500" />
                              )}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Checklist */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Checklist
                    </label>
                    <motion.button
                      type="button"
                      onClick={handleAddChecklist}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      + Add item
                    </motion.button>
                  </div>
                  <div className="space-y-3">
                    {formData.checklist.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleChecklistItem(index)}
                          className="h-4 w-4 text-blue-500 focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
                        />
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => handleChecklistChange(index, e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:placeholder-gray-500 transition-colors"
                          placeholder="Enter checklist item"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Submit Button */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 flex justify-end backdrop-blur-md bg-opacity-90">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskForm;
