import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBoard } from '../store/boardSlice';
import { useNavigate } from 'react-router-dom'; 

const CreateBoard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const boardData = {
      title,
      description,
      members: [], 
      columns: [],
    };

    console.log('Creating board with data:', boardData); 

    try {
      await dispatch(createBoard(boardData)).unwrap(); 
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Failed to create board:', error); 
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-3xl font-bold mb-4">Create New Board</h1>
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
        <button type="submit" className="bg-blue-600 text-white rounded p-2">Create Board</button>
      </form>
    </div>
  );
};

export default CreateBoard;
