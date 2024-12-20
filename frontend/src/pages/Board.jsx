import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { fetchBoardDetails, moveTask, addTask, deleteBoard } from '../store/boardSlice';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const Board = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBoard: board, loading, error } = useSelector((state) => state.boards);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardDetails(boardId));
    }
  }, [dispatch, boardId]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColIndex = parseInt(source.droppableId);
    const destColIndex = parseInt(destination.droppableId);

    // Don't do anything if dropped in the same position
    if (sourceColIndex === destColIndex && source.index === destination.index) {
      return;
    }

    try {
      console.log('[Task Move] Starting move:', {
        taskId: result.draggableId,
        source: {
          columnIndex: sourceColIndex,
          index: source.index
        },
        destination: {
          columnIndex: destColIndex,
          index: destination.index
        }
      });

      // Create deep copies for optimistic update
      const newBoard = JSON.parse(JSON.stringify(board));
      const sourceColumn = [...newBoard.columns[sourceColIndex].tasks];
      const [movedTask] = sourceColumn.splice(source.index, 1);
      
      const destColumn = [...newBoard.columns[destColIndex].tasks];
      destColumn.splice(destination.index, 0, movedTask);
      
      // Update the columns with new task arrays
      newBoard.columns[sourceColIndex].tasks = sourceColumn;
      newBoard.columns[destColIndex].tasks = destColumn;
      
      // Dispatch optimistic update
      dispatch({ type: 'boards/updateCurrentBoard', payload: newBoard });

      // Make the API call
      await dispatch(moveTask({
        boardId,
        taskId: result.draggableId,
        sourceColumnIndex: sourceColIndex,
        destinationColumnIndex: destColIndex,
        position: destination.index
      })).unwrap();

      // Refresh board data to ensure consistency
      dispatch(fetchBoardDetails(boardId));
      toast.success('Task moved successfully');
    } catch (error) {
      console.error('[Task Move] Error:', error);
      toast.error('Failed to move task');
      // Refresh board data to revert to the correct state
      dispatch(fetchBoardDetails(boardId));
    }
  };

  const handleDeleteBoard = async () => {
    try {
      await dispatch(deleteBoard(boardId)).unwrap();
      toast.success('Board deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete board');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Board not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {board.title}
            </h1>
            {board.description && (
              <p className="mt-1 text-gray-600 dark:text-gray-400">{board.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/edit-board/${boardId}`)}
              className="p-2 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors duration-200"
            >
              <FaEdit className="w-5 h-5" />
            </button>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md transition-colors duration-200"
              >
                <FaTrash className="w-5 h-5" />
              </button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Board</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this board? This action cannot be undone.
                    All tasks and columns within this board will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteBoard}
                    className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {board.columns.map((column, columnId) => (
              <div
                key={columnId}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border dark:border-gray-700 overflow-hidden"
              >
                <div className="px-5 py-3 flex items-center justify-between border-b dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {column.title}
                  </h3>
                  <button
                    onClick={() => {
                      setActiveColumn(columnId);
                      setShowTaskForm(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors duration-200"
                  >
                    <FaPlus />
                  </button>
                </div>
                <Droppable droppableId={columnId.toString()}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[200px] p-4 space-y-3"
                    >
                      {column.tasks?.map((task, index) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          index={index}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {showTaskForm && (
          <TaskForm
            boardId={boardId}
            columnId={activeColumn?.toString()}
            onClose={() => setShowTaskForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Board;