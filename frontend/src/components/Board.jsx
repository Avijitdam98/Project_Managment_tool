import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

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

    // Find the source and destination columns
    const sourceColumn = currentBoard.columns.find(col => col._id === source.droppableId);
    const destColumn = currentBoard.columns.find(col => col._id === destination.droppableId);

    if (!sourceColumn || !destColumn) {
      console.error('Could not find source or destination column');
      return;
    }

    // Create new task arrays
    const newSourceTasks = Array.from(sourceColumn.tasks);
    const newDestTasks = source.droppableId === destination.droppableId 
      ? newSourceTasks 
      : Array.from(destColumn.tasks);

    // Remove task from source
    const [movedTask] = newSourceTasks.splice(source.index, 1);

    // Add task to destination
    newDestTasks.splice(destination.index, 0, movedTask);

    // Update the board state
    const newColumns = currentBoard.columns.map(col => {
      if (col._id === source.droppableId) {
        return { ...col, tasks: newSourceTasks };
      }
      if (col._id === destination.droppableId) {
        return { ...col, tasks: newDestTasks };
      }
      return col;
    });

    // Dispatch the update
    dispatch(updateTaskOrder({
      boardId,
      taskId: draggableId,
      sourceColumnId: source.droppableId,
      destinationColumnId: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index
    }));
  };

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
    <div className="flex flex-col h-full overflow-hidden bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
      {/* Board Header */}
      <div className="flex flex-col px-8 py-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex flex-col space-y-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {currentBoard.title}
              </h1>
              {currentBoard.description && (
                <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mt-3 leading-relaxed">
                  {currentBoard.description}
                </p>
              )}
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors h-fit">
              <FaStar className="w-6 h-6 text-gray-400 hover:text-yellow-400" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <FaUsers className="w-5 h-5 mr-3" />
              Share
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <FaCog className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <FaEllipsisH className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Board Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <FaPlus className="w-4 h-4 mr-2.5" />
              Add Task
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-80 px-5 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute right-4 top-3 text-gray-400 w-4 h-4" />
            </div>
            <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <FaFilter className="w-4 h-4 mr-2.5" />
              Filter
            </button>
          </div>

          {/* Board Members */}
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              {currentBoard?.members?.map((member) => (
                <img
                  key={member._id}
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 hover:scale-110 transition-transform duration-200"
                  title={member.name}
                />
              ))}
            </div>
            <button className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
              <FaPlus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 h-full">
            {currentBoard?.columns?.map((column) => (
              <TaskColumn
                key={column._id}
                column={column}
                tasks={currentBoard.tasks.filter(
                  (task) => task.columnId === column._id
                )}
              />
            ))}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-shrink-0 w-80 h-fit p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors"
            >
              <div className="flex items-center justify-center py-3">
                <FaPlus className="w-4 h-4 mr-2.5" />
                Add Column
              </div>
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

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default Board;