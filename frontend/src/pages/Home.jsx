import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaClipboardList, FaUser, FaClock, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { fetchBoards } from '../store/boardSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isPast } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useTheme } from '../components/theme-provider';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { boards } = useSelector((state) => state.boards);
    const [activeFeature, setActiveFeature] = useState(0);
    const { theme } = useTheme();

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
            color: 'bg-blue-500/10 dark:bg-blue-500/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            borderColor: 'border-blue-500/20',
            stats: boards?.length || '0',
            label: 'Active Projects'
        },
        {
            icon: <FaExclamationTriangle className="w-12 h-12" />,
            title: 'Overdue Tasks',
            description: 'Tasks that require immediate attention',
            color: 'bg-red-500/10 dark:bg-red-500/20',
            textColor: 'text-red-600 dark:text-red-400',
            borderColor: 'border-red-500/20',
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
            color: 'bg-purple-500/10 dark:bg-purple-500/20',
            textColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-purple-500/20',
            stats: boards?.reduce((acc, board) => acc + (board.members?.length || 0), 0) || '0',
            label: 'Team Members'
        },
        {
            icon: <FaClock className="w-12 h-12" />,
            title: 'Task Management',
            description: 'Track and manage tasks efficiently with deadlines',
            color: 'bg-green-500/10 dark:bg-green-500/20',
            textColor: 'text-green-600 dark:text-green-400',
            borderColor: 'border-green-500/20',
            stats: boards?.reduce((acc, board) => 
                acc + board.columns?.reduce((sum, col) => sum + (col.tasks?.length || 0), 0), 0) || '0',
            label: 'Active Tasks'
        },
        {
            icon: <FaChartLine className="w-12 h-12" />,
            title: 'Analytics & Insights',
            description: 'Get detailed insights into your project progress',
            color: 'bg-yellow-500/10 dark:bg-yellow-500/20',
            textColor: 'text-yellow-600 dark:text-yellow-400',
            borderColor: 'border-yellow-500/20',
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

    const heroTextVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96]
            }
        },
        hover: { 
            scale: 1.05,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        tap: { 
            scale: 0.95,
            transition: {
                duration: 0.1
            }
        }
    };

    const floatingAnimation = {
        y: [-10, 10],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
        }
    };

    // Auto-rotate features
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [features.length]);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-20">
                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="text-center mb-16 relative"
                >
                    <motion.div
                        animate={floatingAnimation}
                        className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
                    />
                    <motion.h1
                        variants={heroTextVariants}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative z-10"
                    >
                    ProFlowPro Project Management Tool
                    </motion.h1>
                    <motion.p
                        variants={heroTextVariants}
                        className="text-xl md:text-2xl text-muted-foreground mb-8 relative z-10"
                    >
                        {user ? 'Manage your projects and collaborate with your team efficiently.' : 'Experience the future of team collaboration with AI-powered workflows'}
                    </motion.p>
                    <motion.div
                        variants={containerVariants}
                        className="flex flex-wrap justify-center gap-4 relative z-10"
                    >
                        {user ? (
                            <>
                                <Button
                                    asChild
                                    size="lg"
                                    className="px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <Link to="/dashboard">Go to Dashboard</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="px-8"
                                >
                                    <Link to="/dashboard?view=boards">View All Boards</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    size="lg"
                                    className="px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <Link to="/login">Get Started</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="px-8"
                                >
                                    <Link to="/register">Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover="hover"
                            whileTap="tap"
                            custom={index}
                            onClick={() => setActiveFeature(index)}
                        >
                            <Card className={`h-full border transition-all duration-300 ${feature.borderColor} ${
                                index === activeFeature ? 'ring-2 ring-primary' : ''
                            } relative overflow-hidden group`}>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                                />
                                <CardHeader>
                                    <motion.div 
                                        animate={floatingAnimation}
                                        className={`w-12 h-12 rounded-lg ${feature.color} ${feature.textColor} flex items-center justify-center mb-4`}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <CardTitle className={feature.textColor}>{feature.title}</CardTitle>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <motion.div 
                                        className="flex items-center justify-between"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <span className="text-sm text-muted-foreground">{feature.label}</span>
                                        <Badge variant="secondary" className={`${feature.textColor} transform transition-all duration-300 hover:scale-110`}>
                                            {feature.stats}{feature.suffix || ''}
                                        </Badge>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Additional Sections */}
                <div className="space-y-16">
                    {/* Why Choose Us */}
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center relative"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
                        />
                        <h2 className="text-3xl font-bold mb-8">Why Choose ProFlowPro?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Intuitive Interface", desc: "Clean and modern design that makes project management a breeze" },
                                { title: "Real-time Collaboration", desc: "Work together with your team in real-time, from anywhere" },
                                { title: "Powerful Analytics", desc: "Make data-driven decisions with comprehensive project insights" }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <Card className="transform transition-all duration-300 hover:scale-105">
                                        <CardHeader>
                                            <CardTitle>{item.title}</CardTitle>
                                            <CardDescription>{item.desc}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    <Separator className="!my-20" />

                    {/* Call to Action */}
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center relative"
                    >
                        <motion.div
                            animate={floatingAnimation}
                            className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
                        />
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-muted-foreground mb-8">
                            Join thousands of teams already using ALLIN to manage their projects efficiently
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                asChild
                                size="lg"
                                className="px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 relative overflow-hidden group"
                            >
                                <Link to={user ? "/dashboard" : "/register"}>
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                                    />
                                    <span className="relative z-10">
                                        {user ? "Go to Dashboard" : "Start Free Trial"}
                                    </span>
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
};

export default Home;