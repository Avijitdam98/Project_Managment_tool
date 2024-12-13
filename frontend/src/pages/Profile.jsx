import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards } from '../store/boardSlice';
import { FaUser, FaEnvelope, FaClock } from 'react-icons/fa';
import BoardCard from '../components/BoardCard';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { boards, loading } = useSelector((state) => state.boards);
  const [activeTab, setActiveTab] = useState('boards'); // 'boards' or 'settings'

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
        <div className="text-xl">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white uppercase">
                {user.name ? user.name[0] : 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <FaEnvelope className="mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <FaClock className="mr-2" />
                <span>Member since {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'boards'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('boards')}
        >
          My Boards
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'settings'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      {activeTab === 'boards' ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Boards</h2>
          {loading ? (
            <div className="text-center py-4">Loading boards...</div>
          ) : boards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <BoardCard key={board._id} board={board} />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              You haven't created any boards yet.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={user.name}
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={user.email}
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Theme</label>
              <select className="w-full p-2 border rounded">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;