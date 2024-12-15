import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBoard } from '../store/boardSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { FaClipboard } from 'react-icons/fa';

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

    try {
      await dispatch(createBoard(boardData)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FaClipboard className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>Create New Board</CardTitle>
              <CardDescription>Create a new board to organize your project tasks</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Board Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter board title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter board description"
                className="min-h-[100px]"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Board
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateBoard;
