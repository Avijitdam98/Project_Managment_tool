import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTrash, FaUserPlus, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProjectSettings = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
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
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/projects/${projectId}`);
        toast.success('Project deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete project');
        console.error('Error deleting project:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Project Settings</h1>

          {/* Project Details Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Project Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-surface-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-surface-700"
                rows="4"
              />
            </div>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <FaSave className="mr-2" />
              Save Changes
            </button>
          </form>

          {/* Team Management */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Team Members</h2>
            <form onSubmit={handleAddMember} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  name="newMemberEmail"
                  value={formData.newMemberEmail}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-surface-700"
                />
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <FaUserPlus className="mr-2" />
                  Add Member
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {project?.members?.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-surface-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white">
                      {member.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                    </div>
                  </div>
                  {member._id !== project.owner && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h2>
            <button
              onClick={handleDeleteProject}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <FaTrash className="mr-2" />
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectSettings;
