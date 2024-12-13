import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { fetchBoardDetails, updateTaskStatus } from '../store/boardSlice';
import TaskColumn from '../components/TaskColumn';
import CreateTaskModal from '../components/CreateTaskModal';
import { toast } from 'react-toastify';

const BoardDetail = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const { currentBoard, loading } = useSelector((state) => state.boards);

  useEffect(() => {
    dispatch(fetchBoardDetails(boardId));
  }, [boardId, dispatch]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(
      updateTaskStatus({
        taskId: draggableId,
        newStatus: destination.droppableId,
        boardId,
      })
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Board not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {currentBoard.title}
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add Task
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentBoard.columns.map((column) => (
                <Droppable key={column._id} droppableId={column._id}>
                  {(provided) => (
                    <TaskColumn
                      title={column.title}
                      tasks={column.tasks}
                      provided={provided}
                    />
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateTaskModal
          boardId={boardId}
          onClose={() => setIsCreateModalOpen(false)}
          columns={currentBoard.columns}
        />
      )}
    </div>
  );
};

export default BoardDetail;
