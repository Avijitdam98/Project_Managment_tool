import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUsers, FaEdit, FaCog, FaChartLine, FaTasks, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/projects/${projectId}`);
      setProject(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load project details');
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Project Header */}
      <div className="bg-white dark:bg-surface-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
          <Link
            to={`/project/${projectId}/settings`}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaCog className="mr-2" />
            Settings
          </Link>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaTasks className="text-primary-600 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Total Tasks</h3>
              <p className="text-3xl font-bold">{project.tasks?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-600 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Completed</h3>
              <p className="text-3xl font-bold">
                {project.tasks?.filter(task => task.status === 'completed').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaExclamationCircle className="text-yellow-600 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Pending</h3>
              <p className="text-3xl font-bold">
                {project.tasks?.filter(task => task.status !== 'completed').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Team */}
      <div className="bg-white dark:bg-surface-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaUsers className="mr-2" />
          Team Members
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.members?.map((member) => (
            <div
              key={member._id}
              className="flex items-center p-3 bg-gray-50 dark:bg-surface-700 rounded-lg"
            >
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white">
                {member.name?.[0]?.toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetails;
