import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards } from '../store/boardSlice';
import { FaUser, FaEnvelope, FaClock, FaClipboard, FaCog, FaLock, FaBell } from 'react-icons/fa';
import BoardCard from '../components/BoardCard';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { boards, loading } = useSelector((state) => state.boards);
  const [activeTab, setActiveTab] = useState('boards');

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-xl text-center">Please log in to view your profile.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex items-center text-muted-foreground mt-1">
                  <FaEnvelope className="mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-muted-foreground mt-1">
                  <FaClock className="mr-2" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              {user.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="boards" className="flex items-center space-x-2">
            <FaClipboard className="h-4 w-4" />
            <span>My Boards</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <FaCog className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="boards">
          <Card>
            <CardHeader>
              <CardTitle>My Boards</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading boards...</div>
              ) : boards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boards.map((board) => (
                    <BoardCard key={board._id} board={board} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No boards found. Create a new board to get started!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <FaUser className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FaLock className="mr-2 h-4 w-4" /> Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FaBell className="mr-2 h-4 w-4" /> Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;