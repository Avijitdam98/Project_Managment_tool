import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaClipboardList, FaUser, FaClock, FaChartLine, FaExclamationTriangle, FaRocket, FaShieldAlt, FaHeadset, FaGithub, FaTwitter, FaLinkedin, FaArrowRight } from 'react-icons/fa';
import { fetchBoards } from '../store/boardSlice';
import { motion } from 'framer-motion';
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
    const { boards, loading } = useSelector((state) => state.boards);
    const [activeFeature, setActiveFeature] = useState(0);
    const { theme } = useTheme();

    useEffect(() => {
        if (user) {
            dispatch(fetchBoards());
        }
    }, [dispatch, user]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const features = [
        {
            icon: <FaClipboardList className="w-12 h-12" />,
            title: 'Project Management',
            description: 'Create and manage projects with intuitive boards and tasks',
            color: 'bg-blue-500/10 dark:bg-blue-500/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            borderColor: 'border-blue-500/20',
            stats: loading ? '...' : (boards?.length || '0'),
            label: 'Active Projects'
        },
        {
            icon: <FaUser className="w-12 h-12" />,
            title: 'Team Collaboration',
            description: 'Work seamlessly with your team in real-time',
            color: 'bg-purple-500/10 dark:bg-purple-500/20',
            textColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-purple-500/20',
            stats: loading ? '...' : (new Set(boards?.flatMap(board => board.members?.map(member => member._id) || [])).size || '0'),
            label: 'Team Members'
        },
        {
            icon: <FaChartLine className="w-12 h-12" />,
            title: 'Analytics & Insights',
            description: 'Track project progress and team performance metrics',
            color: 'bg-green-500/10 dark:bg-green-500/20',
            textColor: 'text-green-600 dark:text-green-400',
            borderColor: 'border-green-500/20',
            stats: loading ? '...' : (
                boards?.reduce((acc, board) => {
                    const completedTasks = board.columns?.reduce((sum, col) => {
                        return sum + (col.title.toLowerCase().includes('done') ? col.tasks?.length || 0 : 0);
                    }, 0) || 0;
                    const totalTasks = board.columns?.reduce((sum, col) => sum + (col.tasks?.length || 0), 0) || 0;
                    return acc + (totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0);
                }, 0) / (boards?.length || 1)
            ).toFixed(0) + '%',
            label: 'Task Completion'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <motion.section 
                className="relative py-20 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent dark:from-primary/10" />
                <motion.div 
                    className="container mx-auto px-4 relative"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 
                        className="text-5xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                        variants={itemVariants}
                    >
                        Project Flow <br /> Reimagined
                    </motion.h1>
                    <motion.p 
                        className="text-xl text-center text-muted-foreground max-w-2xl mx-auto mb-12"
                        variants={itemVariants}
                    >
                        Streamline your workflow, enhance team collaboration, and deliver projects on time with our powerful project management solution.
                    </motion.p>
                    <motion.div 
                        className="flex justify-center gap-4"
                        variants={itemVariants}
                    >
                        <Button 
                            size="lg" 
                            onClick={() => navigate('/dashboard')}
                            className="group"
                        >
                            Go to Dashboard
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline"
                            onClick={() => navigate('/product/features')}
                        >
                            Learn More
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Features Grid */}
            <motion.section 
                className="py-20 bg-muted/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="container mx-auto px-4">
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="group"
                            >
                                <Card className="h-full border-t-4 transition-all duration-300 hover:shadow-lg">
                                    <CardHeader>
                                        <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${feature.textColor} transition-all duration-300 group-hover:scale-110`}>
                                            {feature.icon}
                                        </div>
                                        <CardTitle className="text-2xl">{feature.title}</CardTitle>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-4xl font-bold ${feature.textColor}`}>
                                                {feature.stats}
                                            </span>
                                            <span className="text-muted-foreground">{feature.label}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
                className="py-24 bg-gradient-to-br from-primary to-primary-foreground/10 text-primary-foreground relative overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="container mx-auto px-4 relative">
                    <motion.div 
                        className="text-center space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.h2 
                            className="text-4xl font-bold"
                            variants={itemVariants}
                        >
                            Start Managing Your Projects Today
                        </motion.h2>
                        <motion.p 
                            className="text-xl opacity-90 max-w-2xl mx-auto"
                            variants={itemVariants}
                        >
                            Access your dashboard to create projects, manage tasks, and collaborate with your team.
                        </motion.p>
                        <motion.div 
                            className="flex justify-center gap-4"
                            variants={itemVariants}
                        >
                            <Button 
                                size="lg" 
                                variant="secondary"
                                onClick={() => navigate('/dashboard')}
                                className="group"
                            >
                                Open Dashboard
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer 
                className="bg-gradient-to-b from-background to-muted relative overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                {/* Decorative grid background */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                
                {/* Animated gradient orbs */}
                <motion.div 
                    className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl opacity-30"
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, -30, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                <div className="container mx-auto px-4 py-16 relative">
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Brand Section */}
                        <motion.div 
                            className="space-y-6"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="flex items-center space-x-2"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.div 
                                    className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <FaRocket className="w-4 h-4 text-primary" />
                                </motion.div>
                                <motion.span 
                                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    ProFlowPro
                                </motion.span>
                            </motion.div>
                            <motion.p 
                                className="text-sm text-muted-foreground"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                Empowering teams to achieve more through intelligent project flow management and seamless collaboration.
                            </motion.p>
                            <motion.div 
                                className="flex gap-4"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                {[
                                    { icon: <FaGithub />, href: "https://github.com", color: "hover:text-[#333]" },
                                    { icon: <FaTwitter />, href: "https://twitter.com", color: "hover:text-[#1DA1F2]" },
                                    { icon: <FaLinkedin />, href: "https://linkedin.com", color: "hover:text-[#0A66C2]" }
                                ].map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground ${social.color} transition-colors`}
                                        whileHover={{ 
                                            scale: 1.1,
                                            rotate: [0, -10, 10, 0],
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        variants={itemVariants}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Links Sections */}
                        {[
                            {
                                title: "Product",
                                links: [
                                    { label: "Features", href: "/product/features" },
                                    { label: "Pricing", href: "/product/pricing" },
                                    { label: "Integrations", href: "/product/integrations" },
                                    { label: "Changelog", href: "/product/changelog" }
                                ]
                            },
                            {
                                title: "Company",
                                links: [
                                    { label: "About", href: "/company/about" },
                                    { label: "Blog", href: "/company/blog" },
                                    { label: "Careers", href: "/company/careers" },
                                    { label: "Contact", href: "/company/contact" }
                                ]
                            },
                            {
                                title: "Legal",
                                links: [
                                    { label: "Privacy Policy", href: "/legal/privacy-policy" },
                                    { label: "Terms of Service", href: "/legal/terms-of-service" },
                                    { label: "Security", href: "/legal/security" },
                                    { label: "Cookie Policy", href: "/legal/cookie-policy" }
                                ]
                            }
                        ].map((section, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="space-y-6"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.h3 
                                    className="font-semibold tracking-wide uppercase text-sm"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {section.title}
                                </motion.h3>
                                <motion.ul 
                                    className="space-y-4"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.05
                                            }
                                        }
                                    }}
                                >
                                    {section.links.map((link, linkIndex) => (
                                        <motion.li 
                                            key={linkIndex}
                                            variants={itemVariants}
                                            className="relative overflow-hidden"
                                        >
                                            <motion.div
                                                className="relative"
                                                whileHover="hover"
                                                animate="rest"
                                                initial="rest"
                                            >
                                                <Link
                                                    to={link.href}
                                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors relative inline-block py-1"
                                                >
                                                    {link.label}
                                                </Link>
                                                {/* Left to right underline */}
                                                <motion.div
                                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-primary"
                                                    variants={{
                                                        rest: { x: "-100%" },
                                                        hover: {
                                                            x: "0%",
                                                            transition: {
                                                                duration: 0.3,
                                                                ease: "easeInOut"
                                                            }
                                                        }
                                                    }}
                                                />
                                                {/* Right to left overlay */}
                                                <motion.div
                                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary to-primary opacity-50"
                                                    variants={{
                                                        rest: { x: "100%" },
                                                        hover: {
                                                            x: "0%",
                                                            transition: {
                                                                duration: 0.3,
                                                                delay: 0.1,
                                                                ease: "easeInOut"
                                                            }
                                                        }
                                                    }}
                                                />
                                                {/* Glow effect */}
                                                <motion.div
                                                    className="absolute inset-0 rounded-lg bg-primary/5 -z-10"
                                                    variants={{
                                                        rest: { 
                                                            opacity: 0,
                                                            scale: 0.9
                                                        },
                                                        hover: {
                                                            opacity: 1,
                                                            scale: 1.1,
                                                            transition: {
                                                                duration: 0.3,
                                                                ease: "easeOut"
                                                            }
                                                        }
                                                    }}
                                                />
                                            </motion.div>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Bottom Bar */}
                    <motion.div 
                        className="mt-16 pt-8 border-t border-muted-foreground/10"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div 
                            className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <motion.p
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {new Date().getFullYear()} ProFlowPro. All rights reserved.
                            </motion.p>
                            <motion.div 
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <span>Made with</span>
                                <motion.span
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 10, -10, 0],
                                        filter: [
                                            'drop-shadow(0 0 0 rgba(239, 68, 68, 0))',
                                            'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))',
                                            'drop-shadow(0 0 0 rgba(239, 68, 68, 0))'
                                        ]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatDelay: 2
                                    }}
                                    className="text-red-500"
                                >
                                    ❤️
                                </motion.span>
                                <motion.div
                                    className="relative"
                                    whileHover="hover"
                                    animate="rest"
                                    initial="rest"
                                >
                                    <motion.span
                                        className="ml-1 relative inline-block"
                                        variants={{
                                            rest: { color: "inherit" },
                                            hover: { 
                                                color: "#6366f1",
                                                transition: { duration: 0.2 }
                                            }
                                        }}
                                    >
                                        ProFlowPro Team
                                    </motion.span>
                                    {/* Double underline effect */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary"
                                        variants={{
                                            rest: { scaleX: 0, originX: 0 },
                                            hover: {
                                                scaleX: 1,
                                                transition: {
                                                    duration: 0.3,
                                                    ease: "circOut"
                                                }
                                            }
                                        }}
                                    />
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary to-primary"
                                        variants={{
                                            rest: { scaleX: 0, originX: 1 },
                                            hover: {
                                                scaleX: 1,
                                                transition: {
                                                    duration: 0.3,
                                                    delay: 0.1,
                                                    ease: "circOut"
                                                }
                                            }
                                        }}
                                    />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    );
};

export default Home;