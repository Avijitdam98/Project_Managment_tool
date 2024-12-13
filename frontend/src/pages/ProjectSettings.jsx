import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaSave, FaTrash, FaTags, FaUsersCog } from 'react-icons/fa';

const ProjectSettings = () => {
  const { projectId } = useParams();
  const [settings, setSettings] = useState({
    name: '',
    description: '',
    visibility: 'private',
    issueTypes: [],
    labels: [],
    priorities: []
  });

  useEffect(() => {
    fetchProjectSettings();
  }, [projectId]);

  const fetchProjectSettings = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/settings`);
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching project settings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/projects/${projectId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      // Show success message
    } catch (error) {
      console.error('Error updating project settings:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        });
        // Redirect to projects list
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Project Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">General</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Issue Types */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Issue Types</h2>
            <div className="space-y-4">
              {settings.issueTypes.map((type, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={type.name}
                    onChange={(e) => {
                      const newTypes = [...settings.issueTypes];
                      newTypes[index].name = e.target.value;
                      setSettings({ ...settings, issueTypes: newTypes });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newTypes = settings.issueTypes.filter((_, i) => i !== index);
                      setSettings({ ...settings, issueTypes: newTypes });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSettings({
                  ...settings,
                  issueTypes: [...settings.issueTypes, { name: '', icon: '' }]
                })}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                + Add Issue Type
              </button>
            </div>
          </div>

          {/* Labels */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Labels</h2>
              <FaTags className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {settings.labels.map((label, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => {
                      const newLabels = [...settings.labels];
                      newLabels[index] = e.target.value;
                      setSettings({ ...settings, labels: newLabels });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newLabels = settings.labels.filter((_, i) => i !== index);
                      setSettings({ ...settings, labels: newLabels });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSettings({ ...settings, labels: [...settings.labels, ''] })}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                + Add Label
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSave className="mr-2" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDeleteProject}
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaTrash className="mr-2" />
              Delete Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSettings;
