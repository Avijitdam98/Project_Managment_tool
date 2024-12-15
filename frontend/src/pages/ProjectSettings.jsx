import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTrash, FaUserPlus, FaTimes, FaCog, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
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

const ProjectSettings = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    newMemberEmail: ''
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/projects/${projectId}`);
      setProject(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description,
        newMemberEmail: ''
      });
    } catch (error) {
      toast.error('Failed to load project details');
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/projects/${projectId}`, {
        name: formData.name,
        description: formData.description
      });
      toast.success('Project updated successfully');
      fetchProjectDetails();
    } catch (error) {
      toast.error('Failed to update project');
      console.error('Error updating project:', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/projects/${projectId}/members`, {
        email: formData.newMemberEmail
      });
      toast.success('Member added successfully');
      setFormData({ ...formData, newMemberEmail: '' });
      fetchProjectDetails();
    } catch (error) {
      toast.error('Failed to add member');
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await axios.delete(`/api/projects/${projectId}/members/${memberId}`);
      toast.success('Member removed successfully');
      fetchProjectDetails();
    } catch (error) {
      toast.error('Failed to remove member');
      console.error('Error removing member:', error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      toast.success('Project deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FaCog className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>Project Settings</CardTitle>
                <CardDescription>Manage your project settings and team members</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="flex items-center space-x-2">
                <FaSave className="w-4 h-4" />
                <span>Save Changes</span>
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FaUsers className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Team Members</h3>
              </div>
              
              <form onSubmit={handleAddMember} className="flex space-x-2">
                <div className="flex-grow">
                  <Input
                    name="newMemberEmail"
                    value={formData.newMemberEmail}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    type="email"
                    required
                  />
                </div>
                <Button type="submit" className="flex items-center space-x-2">
                  <FaUserPlus className="w-4 h-4" />
                  <span>Add</span>
                </Button>
              </form>

              <div className="space-y-2">
                {project?.members?.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{member.email}</span>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <FaTimes className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTitle className="text-destructive">Danger Zone</AlertTitle>
                <AlertDescription>
                  Once you delete a project, there is no going back. Please be certain.
                </AlertDescription>
              </Alert>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center space-x-2"
              >
                <FaTrash className="w-4 h-4" />
                <span>Delete Project</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectSettings;
