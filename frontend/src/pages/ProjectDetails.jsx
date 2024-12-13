import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUsers, FaEdit, FaCog, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({
    totalIssues: 0,
    openIssues: 0,
    completedIssues: 0
  });

  useEffect(() => {
    // Fetch project details
    fetchProjectDetails();
    fetchProjectMembers();
    fetchProjectStats();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchProjectMembers = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/members`);
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching project members:', error);
    }
  };

  const fetchProjectStats = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching project stats:', error);
    }
  };

  if (!project) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
          </div>
          <div className="flex gap-4">
            <Link
              to={`/projects/${projectId}/settings`}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FaCog className="mr-2" />
              Settings
            </Link>
            <Link
              to={`/projects/${projectId}/edit`}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <FaEdit className="mr-2" />
              Edit Project
            </Link>
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-10">
              <FaChartLine className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Issues</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalIssues}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500 bg-opacity-10">
              <FaChartLine className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completedIssues}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500 bg-opacity-10">
              <FaChartLine className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalIssues - stats.completedIssues}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project Members */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Members</h2>
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => {/* Add member modal */}}
          >
            <FaUsers className="mr-2" />
            Add Member
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <img
                src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                alt={member.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
