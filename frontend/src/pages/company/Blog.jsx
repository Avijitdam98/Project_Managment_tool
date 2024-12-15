import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { FaSearch, FaClock, FaUser, FaTags } from 'react-icons/fa';

const Blog = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        "All",
        "Product Updates",
        "Project Management",
        "Team Collaboration",
        "Productivity",
        "Industry Insights"
    ];

    const blogPosts = [
        {
            title: "10 Project Management Trends to Watch in 2024",
            excerpt: "Discover the latest trends shaping the future of project management and how they'll impact your team.",
            author: "Sarah Johnson",
            date: "Dec 15, 2023",
            category: "Industry Insights",
            readTime: "5 min read",
            image: "https://picsum.photos/seed/post1/800/400"
        },
        {
            title: "Introducing ProPlow's New Analytics Dashboard",
            excerpt: "Get a deeper understanding of your team's performance with our enhanced analytics features.",
            author: "Michael Chen",
            date: "Dec 10, 2023",
            category: "Product Updates",
            readTime: "3 min read",
            image: "https://picsum.photos/seed/post2/800/400"
        },
        {
            title: "Building High-Performing Remote Teams",
            excerpt: "Learn proven strategies for managing and motivating distributed teams effectively.",
            author: "Emily Rodriguez",
            date: "Dec 5, 2023",
            category: "Team Collaboration",
            readTime: "7 min read",
            image: "https://picsum.photos/seed/post3/800/400"
        },
        {
            title: "The Art of Project Estimation",
            excerpt: "Master the techniques for accurate project estimation and deliver on time, every time.",
            author: "David Kim",
            date: "Dec 1, 2023",
            category: "Project Management",
            readTime: "6 min read",
            image: "https://picsum.photos/seed/post4/800/400"
        },
        {
            title: "5 Ways to Boost Team Productivity",
            excerpt: "Simple but effective strategies to enhance your team's productivity and workflow.",
            author: "Lisa Wang",
            date: "Nov 28, 2023",
            category: "Productivity",
            readTime: "4 min read",
            image: "https://picsum.photos/seed/post5/800/400"
        },
        {
            title: "The Future of Work: AI in Project Management",
            excerpt: "Explore how artificial intelligence is transforming project management practices.",
            author: "James Wilson",
            date: "Nov 25, 2023",
            category: "Industry Insights",
            readTime: "8 min read",
            image: "https://picsum.photos/seed/post6/800/400"
        }
    ];

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory.toLowerCase() === 'all' || 
                              post.category.toLowerCase() === selectedCategory.toLowerCase();
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
                            ProPlow Blog
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            Insights, updates, and expert perspectives on project management
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
                                placeholder="Search articles..."
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
                    <div className="flex flex-wrap gap-4 justify-center">
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Button
                                    variant={selectedCategory.toLowerCase() === category.toLowerCase() ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(category.toLowerCase())}
                                >
                                    {category}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Posts */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-300">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img 
                                            src={post.image} 
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary">{post.category}</Badge>
                                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <FaClock className="w-3 h-3" /> {post.readTime}
                                            </span>
                                        </div>
                                        <CardTitle className="hover:text-primary cursor-pointer">
                                            {post.title}
                                        </CardTitle>
                                        <CardDescription>{post.excerpt}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FaUser className="text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">{post.author}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{post.date}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                        <p className="text-muted-foreground mb-8">
                            Get the latest insights and updates delivered to your inbox
                        </p>
                        <div className="flex gap-4 max-w-md mx-auto">
                            <Input 
                                type="email" 
                                placeholder="Enter your email"
                            />
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog;
