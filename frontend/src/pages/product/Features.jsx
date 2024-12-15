import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FaCheckCircle, FaRocket, FaUsers, FaChartLine, FaBell, FaMobile, FaLock, FaCloud } from 'react-icons/fa';

const features = [
    {
        icon: <FaRocket />,
        title: "Task Management",
        description: "Create, assign, and track tasks with ease. Set priorities, deadlines, and dependencies.",
        benefits: [
            "Drag-and-drop task organization",
            "Custom task fields and labels",
            "Task dependencies and subtasks",
            "File attachments and comments"
        ]
    },
    {
        icon: <FaUsers />,
        title: "Team Collaboration",
        description: "Work together seamlessly with your team members. Real-time updates and notifications.",
        benefits: [
            "Real-time collaboration",
            "Team chat and discussions",
            "Role-based permissions",
            "Activity tracking"
        ]
    },
    {
        icon: <FaChartLine />,
        title: "Analytics & Reporting",
        description: "Get insights into your project progress with detailed analytics and custom reports.",
        benefits: [
            "Project progress tracking",
            "Team performance metrics",
            "Custom report generation",
            "Data visualization"
        ]
    },
    {
        icon: <FaBell />,
        title: "Smart Notifications",
        description: "Stay updated with intelligent notifications about your projects and tasks.",
        benefits: [
            "Custom notification rules",
            "Email and in-app alerts",
            "Mention notifications",
            "Due date reminders"
        ]
    },
    {
        icon: <FaMobile />,
        title: "Mobile Access",
        description: "Access your projects on the go with our mobile-responsive design.",
        benefits: [
            "Mobile-responsive interface",
            "Native mobile apps",
            "Offline access",
            "Touch-optimized UI"
        ]
    },
    {
        icon: <FaLock />,
        title: "Security",
        description: "Enterprise-grade security to keep your data safe and compliant.",
        benefits: [
            "End-to-end encryption",
            "Two-factor authentication",
            "Regular security audits",
            "GDPR compliance"
        ]
    }
];

const Features = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/10 to-background">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                        >
                            Powerful Features for Modern Teams
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            Everything you need to manage projects effectively and keep your team productive
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Button size="lg" className="mr-4">Start Free Trial</Button>
                            <Button size="lg" variant="outline">Contact Sales</Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                                            {feature.icon}
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {feature.benefits.map((benefit, i) => (
                                                <li key={i} className="flex items-center text-sm">
                                                    <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integration Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Integrate with Your Favorite Tools</h2>
                        <p className="text-muted-foreground">
                            Connect ProPlow with the tools your team already uses to create a seamless workflow
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {['Slack', 'GitHub', 'Jira', 'Google Drive', 'Dropbox', 'Zoom'].map((tool, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center justify-center"
                            >
                                <Card className="w-full h-24 flex items-center justify-center hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4">
                                        <p className="font-semibold text-center">{tool}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-xl opacity-90 mb-8">
                            Join thousands of teams who use ProPlow to deliver their projects on time
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" variant="secondary">
                                Start Free Trial
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent hover:bg-primary-foreground/10">
                                Schedule Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
