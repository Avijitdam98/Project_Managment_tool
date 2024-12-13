import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchBoardDetails, updateBoard } from '../store/boardSlice';

const EditBoard = () => {
  const { boardId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getBoardDetails = async () => {
      const data = await dispatch(fetchBoardDetails(boardId)).unwrap();
      setTitle(data.title);
      setDescription(data.description);
    };
    getBoardDetails();
  }, [boardId, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBoardData = {
      title,
      description,
    };

    await dispatch(updateBoard({ boardId, updatedBoardData })).unwrap();
    navigate(`/board/${boardId}`); // Redirect after updating
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-3xl font-bold mb-4">Edit Board</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Board Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white rounded p-2">Update Board</button>
      </form>
    </div>
  );
};

export default EditBoard;
