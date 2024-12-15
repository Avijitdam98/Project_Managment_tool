import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchBoardDetails, updateBoard } from '../store/boardSlice';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { FaEdit, FaArrowLeft } from 'react-icons/fa';

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

    try {
      await dispatch(updateBoard({ boardId, boardData: updatedBoardData })).unwrap();
      navigate(`/board/${boardId}`);
    } catch (error) {
      console.error('Failed to update board:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FaEdit className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>Edit Board</CardTitle>
              <CardDescription>Update your board details</CardDescription>
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
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/board/${boardId}`)}
              className="flex items-center space-x-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <Button type="submit" className="flex items-center space-x-2">
              <FaEdit className="w-4 h-4" />
              <span>Update Board</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditBoard;
