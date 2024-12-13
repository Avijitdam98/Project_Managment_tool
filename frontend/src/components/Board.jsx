import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { fetchBoardDetails, updateTaskOrder, initializeBoard } from '../store/boardSlice';
import TaskColumn from './TaskColumn';
import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';
import { FaPlus, FaEllipsisH, FaUsers, FaFilter, FaStar, FaSearch, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { joinBoard, leaveBoard } from '../services/socket';

const Board = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const { currentBoard, loading, error } = useSelector((state) => state.boards);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardDetails(boardId)).then((action) => {
        if (action.payload) {
          dispatch(initializeBoard(action.payload));
        }
      });
    }
    // Join board room for real-time updates
    joinBoard(boardId);

    // Cleanup
    return () => {
      dispatch(clearCurrentBoard());
      leaveBoard(boardId);
    };
  }, [boardId, dispatch]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(
      updateTaskOrder({
        boardId,
        taskId: draggableId,
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        newIndex: destination.index,
      })
    );
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const response = await updateTask(boardId, updatedTask.column, updatedTask._id, updatedTask);
      const updatedBoard = {
        ...currentBoard,
        columns: currentBoard.columns.map(column => ({
          ...column,
          tasks: column.tasks.map(task => 
            task._id === updatedTask._id ? response.data : task
          )
        }))
      };
      dispatch(initializeBoard(updatedBoard));
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update task');
    }
  };

  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-error text-lg">{error}</div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-center mt-4">Board not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-surface-50/50 backdrop-blur-sm">
      {/* Board Header */}
      <div className="glass-card p-4 border-b border-surface-200/50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-surface-900">{currentBoard.title}</h1>
            <button
              onClick={() => setIsStarred(!isStarred)}
              className={`btn-modern p-2 ${
                isStarred ? 'text-yellow-500' : 'text-surface-400'
              }`}
            >
              <FaStar className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern pl-10 pr-4 py-2 w-64"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            </div>

            {/* Filter Button */}
            <button className="btn-secondary">
              <FaFilter className="w-4 h-4" />
            </button>

            {/* Members */}
            <div className="flex -space-x-2">
              {currentBoard?.members?.map((member) => (
                <img
                  key={member._id}
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-white hover:scale-110 
                    transition-transform duration-300 cursor-pointer"
                  title={member.name}
                />
              ))}
              <button className="btn-secondary w-8 h-8 rounded-full flex items-center justify-center">
                <FaPlus className="w-3 h-3" />
              </button>
            </div>

            {/* Settings */}
            <button className="btn-secondary">
              <FaCog className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full min-h-[calc(100vh-12rem)]">
            {Object.entries(currentBoard.columns).map(([columnId, column]) => (
              <TaskColumn
                key={columnId}
                column={column}
                onEditTask={handleEditTask}
              />
            ))}
            
            {/* Add Column Button */}
            <button className="glass-card h-fit min-w-[300px] p-4 rounded-xl flex items-center 
              justify-center gap-2 text-surface-500 hover:text-surface-700 group">
              <FaPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Column</span>
            </button>
          </div>
        </DragDropContext>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateTaskModal
          boardId={boardId}
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={(newTask) => {
            const updatedBoard = {
              ...currentBoard,
              columns: currentBoard.columns.map(col => 
                col._id === newTask.column
                  ? { ...col, tasks: [...col.tasks, newTask] }
                  : col
              )
            };
            dispatch(initializeBoard(updatedBoard));
          }}
        />
      )}

      {showEditModal && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Board;