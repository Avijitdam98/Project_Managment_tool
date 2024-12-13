import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash, FaEllipsisH, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa';
import { deleteBoard } from '../store/boardSlice';
import { toast } from 'react-toastify';

const BoardCard = ({ board }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await dispatch(deleteBoard(board._id)).unwrap();
      toast.success('Board deleted successfully');
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete board');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit-board/${board._id}`);
  };

  // Calculate total tasks and completed tasks from the new column structure
  const totalTasks = Object.values(board.columns || {}).reduce(
    (total, column) => total + (column.tasks?.length || 0),
    0
  );

  const completedTasks = Object.values(board.columns || {}).reduce(
    (total, column) => {
      if (column.id === 'done') {
        return total + (column.tasks?.length || 0);
      }
      return total;
    },
    0
  );

  return (
    <div
      onClick={() => navigate(`/board/${board._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="h-full w-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.4" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors">
            {board.title || 'Untitled Board'}
          </h3>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit Board"
            >
              <FaEdit />
            </button>
            {showDeleteConfirm ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(false);
                  }}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Delete Board"
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <FaUsers className="text-gray-400" />
              <span>{board.members?.length || 0} members</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-green-500" />
              <span>
                {completedTasks}/{totalTasks} tasks
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-gray-400" />
              <span>{new Date(board.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BoardCard.propTypes = {
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    members: PropTypes.array,
    columns: PropTypes.object,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default BoardCard;
