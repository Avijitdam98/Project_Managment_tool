import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaClipboardList, FaPlus, FaUser, FaClock, FaBell, FaStar, FaEllipsisH, FaTimes, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { fetchBoards } from '../store/boardSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isPast } from 'date-fns';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { boards } = useSelector((state) => state.boards);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        if (user) {
            dispatch(fetchBoards());
        }
    }, [dispatch, user]);

    const features = [
        {
            icon: <FaClipboardList className="w-12 h-12" />,
            title: 'Project Management',
            description: 'Create and manage projects with intuitive boards and tasks',
            color: 'from-blue-500 to-blue-600',
            stats: boards?.length || '0',
            label: 'Active Projects'
        },
        {
            icon: <FaExclamationTriangle className="w-12 h-12" />,
            title: 'Overdue Tasks',
            description: 'Tasks that require immediate attention',
            color: 'from-red-500 to-red-600',
            stats: boards?.reduce((acc, board) => {
                return acc + board.columns?.reduce((sum, col) => {
                    const overdueTasks = col.tasks?.filter(task => 
                        task.dueDate && isPast(new Date(task.dueDate)) && 
                        !col.title.toLowerCase().includes('done')
                    )?.length || 0;
                    return sum + overdueTasks;
                }, 0) || 0;
            }, 0) || '0',
            label: 'Overdue Tasks'
        },
        {
            icon: <FaUser className="w-12 h-12" />,
            title: 'Team Collaboration',
            description: 'Work together seamlessly with your team members',
            color: 'from-purple-500 to-purple-600',
            stats: boards?.reduce((acc, board) => acc + (board.members?.length || 0), 0) || '0',
            label: 'Team Members'
        },
        {
            icon: <FaClock className="w-12 h-12" />,
            title: 'Task Management',
            description: 'Track and manage tasks efficiently with deadlines',
            color: 'from-green-500 to-green-600',
            stats: boards?.reduce((acc, board) => 
                acc + board.columns?.reduce((sum, col) => sum + (col.tasks?.length || 0), 0), 0) || '0',
            label: 'Active Tasks'
        },
        {
            icon: <FaChartLine className="w-12 h-12" />,
            title: 'Analytics & Insights',
            description: 'Get detailed insights into your project progress',
            color: 'from-yellow-500 to-yellow-600',
            stats: Math.round(boards?.reduce((acc, board) => {
                const doneTasks = board.columns?.find(col => 
                    col.title.toLowerCase().includes('done'))?.tasks?.length || 0;
                const totalTasks = board.columns?.reduce((sum, col) => 
                    sum + (col.tasks?.length || 0), 0) || 0;
                return totalTasks > 0 ? acc + (doneTasks / totalTasks) : acc;
            }, 0) / (boards?.length || 1) * 100) || '0',
            label: 'Completion Rate',
            suffix: '%'
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Auto-rotate features
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [features.length]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="container mx-auto px-4 py-20">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                    >
                        ProFlowPro Management
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-300 mb-8"
                    >
                        {user ? 'Manage your projects and collaborate with your team efficiently.' : 'Experience the future of team collaboration with AI-powered workflows'}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                                >
                                    Go to Dashboard
                                </Link>
                                <Link
                                    to="/dashboard?view=boards"
                                    className="px-8 py-4 bg-transparent border-2 border-purple-500 rounded-full font-bold text-lg hover:bg-purple-500/10 transition-all duration-300"
                                >
                                    View All Boards
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-transparent border-2 border-purple-500 rounded-full font-bold text-lg hover:bg-purple-500/10 transition-all duration-300"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform`}
                            style={{
                                opacity: index === activeFeature ? 1 : 0.7,
                                transform: `scale(${index === activeFeature ? 1.05 : 1})`,
                            }}
                            onClick={() => setActiveFeature(index)}
                        >
                            <div className="text-white mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-200 mb-4">{feature.description}</p>
                            <div className="flex items-center justify-between text-sm font-semibold text-white/80">
                                <span>{feature.label}</span>
                                <span>{feature.stats}{feature.suffix || ''}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        Ready to Transform Your Workflow?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Join thousands of teams already using our platform
                    </p>
                    <Link
                        to={user ? '/dashboard' : '/register'}
                        className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                    >
                        {user ? 'Go to Dashboard' : 'Start Free Trial'}
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;