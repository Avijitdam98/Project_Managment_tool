import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { FaSearch, FaGithub, FaSlack, FaJira, FaGoogle, FaDropbox, FaTrello, FaMicrosoft } from 'react-icons/fa';
import { BiVideo } from 'react-icons/bi';

const Integrations = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        "All",
        "Project Management",
        "Communication",
        "File Storage",
        "Development",
        "Productivity"
    ];

    const integrations = [
        {
            name: "GitHub",
            icon: <FaGithub className="w-8 h-8" />,
            category: "Development",
            description: "Connect your repositories and track code changes directly in ProPlow.",
            features: [
                "Automatic issue syncing",
                "Pull request notifications",
                "Commit tracking",
                "Branch management"
            ],
            popular: true
        },
        {
            name: "Slack",
            icon: <FaSlack className="w-8 h-8" />,
            category: "Communication",
            description: "Get real-time notifications and updates in your Slack channels.",
            features: [
                "Task notifications",
                "Channel integration",
                "Command shortcuts",
                "Direct messaging"
            ],
            popular: true
        },
        {
            name: "Jira",
            icon: <FaJira className="w-8 h-8" />,
            category: "Project Management",
            description: "Sync your Jira issues and track progress across both platforms.",
            features: [
                "Two-way sync",
                "Issue tracking",
                "Sprint planning",
                "Custom field mapping"
            ],
            popular: true
        },
        {
            name: "Google Workspace",
            icon: <FaGoogle className="w-8 h-8" />,
            category: "Productivity",
            description: "Integrate with Google Docs, Sheets, and Calendar.",
            features: [
                "Document embedding",
                "Calendar sync",
                "Single sign-on",
                "File sharing"
            ],
            popular: false
        },
        {
            name: "Dropbox",
            icon: <FaDropbox className="w-8 h-8" />,
            category: "File Storage",
            description: "Access and share your Dropbox files within ProPlow.",
            features: [
                "File preview",
                "Version control",
                "Automatic sync",
                "Shared folders"
            ],
            popular: false
        },
        {
            name: "Trello",
            icon: <FaTrello className="w-8 h-8" />,
            category: "Project Management",
            description: "Import your Trello boards and cards into ProPlow.",
            features: [
                "Board sync",
                "Card migration",
                "Label mapping",
                "Checklist sync"
            ],
            popular: false
        },
        {
            name: "Microsoft Teams",
            icon: <FaMicrosoft className="w-8 h-8" />,
            category: "Communication",
            description: "Collaborate with your team using Microsoft Teams integration.",
            features: [
                "Channel notifications",
                "Meeting scheduling",
                "File sharing",
                "Task updates"
            ],
            popular: false
        },
        {
            name: "Zoom",
            icon: <BiVideo className="w-8 h-8" />,
            category: "Communication",
            description: "Schedule and join Zoom meetings directly from ProPlow.",
            features: [
                "Meeting scheduling",
                "One-click join",
                "Recording access",
                "Calendar sync"
            ],
            popular: false
        }
    ];

    const filteredIntegrations = integrations.filter(integration => {
        const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            integration.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory.toLowerCase() === 'all' || 
                              integration.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

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
                            Connect Your Favorite Tools
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            Seamlessly integrate ProPlow with your existing workflow
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative max-w-xl mx-auto"
                        >
                            <Input
                                type="text"
                                placeholder="Search integrations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12"
                            />
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-8 border-b">
                <div className="container mx-auto px-4">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
                            {categories.map((category, index) => (
                                <TabsTrigger
                                    key={index}
                                    value={category.toLowerCase()}
                                    onClick={() => setSelectedCategory(category.toLowerCase())}
                                >
                                    {category}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </section>

            {/* Integrations Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredIntegrations.map((integration, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                {integration.icon}
                                            </div>
                                            {integration.popular && (
                                                <Badge variant="secondary">Popular</Badge>
                                            )}
                                        </div>
                                        <CardTitle>{integration.name}</CardTitle>
                                        <CardDescription>{integration.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <h4 className="font-semibold">Key Features:</h4>
                                            <ul className="space-y-2">
                                                {integration.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center text-muted-foreground">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button className="w-full mt-4">
                                                Connect {integration.name}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* API Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Build Your Own Integration</h2>
                        <p className="text-muted-foreground mb-8">
                            Access our comprehensive API documentation and build custom integrations
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button>View API Docs</Button>
                            <Button variant="outline">Join Developer Community</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
                        <p className="text-muted-foreground mb-8">
                            Our integration specialists are here to help you get connected
                        </p>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <h3 className="font-semibold mb-2">Documentation</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Step-by-step integration guides
                                        </p>
                                        <Button variant="outline">View Docs</Button>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-semibold mb-2">Community</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Join our developer community
                                        </p>
                                        <Button variant="outline">Join Forum</Button>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-semibold mb-2">Support</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Get help from our team
                                        </p>
                                        <Button variant="outline">Contact Support</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Integrations;
