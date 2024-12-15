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
    dueDate: new Date(),
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
    setLoading(true);

    try {
      console.log('[TaskForm] Submitting task:', {
        boardId,
        columnId,
        formData: {
          ...formData,
          assignee: formData.assignee || null,
          dueDate: formData.dueDate ? formData.dueDate.toISOString() : null
        }
      });

      const resultAction = await dispatch(addTask({
        boardId,
        columnId,
        taskData: {
          ...formData,
          assignee: formData.assignee || null,
          dueDate: formData.dueDate ? formData.dueDate.toISOString() : null
        }
      })).unwrap();

      toast.success('Task created successfully');
      dispatch(addNotification({
        type: 'success',
        message: 'New task created',
        description: `Task "${formData.title}" has been created.`
      }));
      onClose();
    } catch (error) {
      console.error('[TaskForm] Error:', error);
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
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          variants={formVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl border dark:border-gray-700 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Task</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter task description"
                rows="3"
              />
            </div>

            {/* Due Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.dueDate}
                  onChange={(date) => setFormData({ ...formData, dueDate: date })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                  placeholderText="Select due date"
                  required
                />
                <FaCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <div className="flex gap-2">
                {priorities.map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: value })}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                      formData.priority === value
                        ? `${color} text-white`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignee
              </label>
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-left flex items-center justify-between transition-colors"
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
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            {user.name}
                          </motion.button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                          No users available
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Labels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Labels
              </label>
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setShowLabelDropdown(!showLabelDropdown)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-left flex items-center justify-between transition-colors"
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
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100 flex items-center justify-between transition-colors first:rounded-t-lg last:rounded-b-lg"
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
            </div>

            {/* Checklist */}
            <div>
              <div className="flex justify-between items-center mb-2">
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
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Enter checklist item"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskForm;
