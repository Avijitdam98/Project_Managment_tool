import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { fetchBoardDetails, moveTask, addTask } from '../store/boardSlice';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Board = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const { currentBoard: board, loading, error } = useSelector((state) => state.boards);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardDetails(boardId));
    }
  }, [dispatch, boardId]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    try {
      await dispatch(moveTask({
        boardId,
        taskId: result.draggableId,
        sourceColumnIndex: source.droppableId,
        destinationColumnIndex: destination.droppableId,
        newPosition: destination.index
      })).unwrap();
      
      toast.success('Task moved successfully');
    } catch (error) {
      toast.error('Failed to move task');
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{board.title}</h1>
          {board.description && (
            <p className="mt-1 text-gray-600 dark:text-gray-400">{board.description}</p>
          )}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {board.columns.map((column, columnId) => (
              <div
                key={columnId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {column.title}
                  </h3>
                  <button
                    onClick={() => {
                      setActiveColumn(columnId);
                      setShowTaskForm(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <FaPlus />
                  </button>
                </div>

                <Droppable droppableId={columnId.toString()}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[200px]"
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
