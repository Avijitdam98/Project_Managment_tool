import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaClipboardList, FaPlus, FaUser, FaClock, FaBell, FaStar, FaEllipsisH, FaTimes, FaChartLine } from 'react-icons/fa';
import { fetchBoards, createBoard } from '../store/boardSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ProjectAnalytics from '../components/ProjectAnalytics';
import TaskTimeline from '../components/TaskTimeline';
import DashboardCharts from '../components/DashboardCharts';

const CreateBoardModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description });
        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Board</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Board Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter board title"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter board description"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mr-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Create Board
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const BoardCard = ({ board }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-200 border dark:border-gray-700"
    >
        <div className="p-5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div
                        className="w-8 h-8 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: board.color || '#4F46E5' }}
                    >
                        <FaClipboardList className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {board.title}
                    </h3>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none">
                    <FaEllipsisH />
                </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {board.description || 'No description provided'}
            </p>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                        {board.members?.slice(0, 3).map((member, index) => (
                            <img
                                key={index}
                                src={member.avatar || '/default-avatar.png'}
                                alt={member.name}
                                className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                            />
                        ))}
                        {board.members?.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-800">
                                +{board.members.length - 3}
                            </div>
                        )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(board.updatedAt), 'MMM d')}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {board.columns?.reduce((acc, col) => acc + (col.tasks?.length || 0), 0) || 0} tasks
                    </span>
                </div>
            </div>
        </div>
        <Link
            to={`/board/${board._id}`}
            className="block px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-sm text-center text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-b-2xl"
        >
            Open Board
        </Link>
    </motion.div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view');
    
    const { boards, loading } = useSelector((state) => state.boards);
    const { user } = useSelector((state) => state.auth);
    const darkMode = useSelector((state) => state.theme?.darkMode) || false;
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [selectedBoardForTimeline, setSelectedBoardForTimeline] = useState(null);

    useEffect(() => {
        dispatch(fetchBoards());
    }, [dispatch]);

    const handleCreateBoard = async (boardData) => {
        try {
            const resultAction = await dispatch(createBoard(boardData));
            if (createBoard.fulfilled.match(resultAction)) {
                const newBoard = resultAction.payload;
                navigate(`/board/${newBoard._id}`);
            }
        } catch (error) {
            console.error('Failed to create board:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const renderDashboardView = () => (
        <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border dark:border-gray-700"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Boards</p>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{boards.length}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <FaClipboardList className="text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border dark:border-gray-700"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Tasks</p>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {boards.reduce((acc, board) => 
                                    acc + board.columns?.reduce((sum, col) => sum + (col.tasks?.length || 0), 0), 0)}
                            </h3>
                        </div>
                        <div className="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <FaClock className="text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border dark:border-gray-700"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Team Members</p>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {new Set(boards.flatMap(board => board.members?.map(member => member._id) || [])).size}
                            </h3>
                        </div>
                        <div className="w-10 h-10 rounded-md bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <FaUser className="text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border dark:border-gray-700"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {Math.round(boards.reduce((acc, board) => {
                                    const doneTasks = board.columns?.find(col => 
                                        col.title.toLowerCase().includes('done'))?.tasks?.length || 0;
                                    const totalTasks = board.columns?.reduce((sum, col) => 
                                        sum + (col.tasks?.length || 0), 0) || 0;
                                    return totalTasks > 0 ? acc + (doneTasks / totalTasks) : acc;
                                }, 0) / (boards.length || 1) * 100)}%
                            </h3>
                        </div>
                        <div className="w-10 h-10 rounded-md bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                            <FaChartLine className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Analytics Charts */}
            <div className="mb-8">
                <DashboardCharts boards={boards} isDark={darkMode} />
            </div>

            {/* Project Timeline */}
            <div className="col-span-full mt-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border dark:border-gray-700">
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Timeline</h3>
                            <div className="flex items-center space-x-4">
                                <select
                                    value={selectedBoardForTimeline?._id || ''}
                                    onChange={(e) => {
                                        const board = boards.find(b => b._id === e.target.value);
                                        setSelectedBoardForTimeline(board);
                                    }}
                                    className="p-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Boards</option>
                                    {boards.map(board => (
                                        <option key={board._id} value={board._id}>
                                            {board.title}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    onClick={() => setShowAnalytics(!showAnalytics)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                    {showAnalytics ? 'Hide Details' : 'Show Details'}
                                </button>
                            </div>
                        </div>
                        <TaskTimeline 
                            boards={selectedBoardForTimeline ? [selectedBoardForTimeline] : boards}
                            showDetails={showAnalytics}
                        />
                    </div>
                </div>
            </div>
        </>
    );

    const renderBoardsView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
                <BoardCard key={board._id} board={board} />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {view === 'boards' ? 'All Boards' : 'Dashboard'}
                    </h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FaPlus className="mr-2" />
                        New Board
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-4 mb-6">
                    <Link
                        to="/dashboard"
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            !view ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Overview
                    </Link>
                    <Link
                        to="/dashboard?view=boards"
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            view === 'boards' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        All Boards
                    </Link>
                </div>

                {view === 'boards' ? renderBoardsView() : renderDashboardView()}

                <CreateBoardModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateBoard}
                />
            </div>
        </div>
    );
};

export default Dashboard;