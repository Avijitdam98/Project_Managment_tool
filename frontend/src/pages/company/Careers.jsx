import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { FaBriefcase, FaGlobe, FaRocket, FaUsers, FaHeart, FaGraduationCap } from 'react-icons/fa';

const Careers = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    const benefits = [
        {
            icon: <FaGlobe />,
            title: "Remote-First",
            description: "Work from anywhere in the world"
        },
        {
            icon: <FaRocket />,
            title: "Growth Opportunities",
            description: "Clear career progression paths"
        },
        {
            icon: <FaHeart />,
            title: "Health & Wellness",
            description: "Comprehensive health coverage"
        },
        {
            icon: <FaGraduationCap />,
            title: "Learning Budget",
            description: "Annual budget for skill development"
        }
    ];

    const positions = [
        {
            title: "Senior Frontend Engineer",
            department: "Engineering",
            location: "Remote",
            type: "Full-time",
            description: "Join our frontend team to build beautiful and performant user interfaces.",
            requirements: [
                "5+ years of React experience",
                "Strong TypeScript skills",
                "Experience with modern frontend tools",
                "Excellent problem-solving abilities"
            ]
        },
        {
            title: "Product Manager",
            department: "Product",
            location: "Remote",
            type: "Full-time",
            description: "Drive product strategy and work closely with engineering and design teams.",
            requirements: [
                "3+ years of product management experience",
                "Strong analytical skills",
                "Excellent communication abilities",
                "Experience with agile methodologies"
            ]
        },
        {
            title: "UX Designer",
            department: "Design",
            location: "Remote",
            type: "Full-time",
            description: "Create intuitive and delightful user experiences for our products.",
            requirements: [
                "3+ years of UX design experience",
                "Strong portfolio of work",
                "Experience with design systems",
                "User research experience"
            ]
        },
        {
            title: "DevOps Engineer",
            department: "Engineering",
            location: "Remote",
            type: "Full-time",
            description: "Build and maintain our cloud infrastructure and deployment pipelines.",
            requirements: [
                "4+ years of DevOps experience",
                "Strong AWS knowledge",
                "Experience with Docker and Kubernetes",
                "Infrastructure as Code experience"
            ]
        }
    ];

    const filteredPositions = selectedDepartment === 'all' 
        ? positions 
        : positions.filter(pos => pos.department.toLowerCase() === selectedDepartment.toLowerCase());

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
                            Join Our Team
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            Help us transform how teams work together
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Button size="lg">View Open Positions</Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    At ProPlow, we believe in fostering an environment where creativity thrives 
                                    and innovation is encouraged. Our team is made up of passionate individuals 
                                    who are committed to transforming how teams work together.
                                </p>
                                <p className="text-muted-foreground">
                                    We value diversity, continuous learning, and maintaining a healthy work-life 
                                    balance. Our remote-first culture enables us to hire the best talent from 
                                    around the world while providing the flexibility to work where you're most 
                                    productive.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[400px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg"
                        >
                            {/* Add team culture image or illustration here */}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Join Us?</h2>
                        <p className="text-muted-foreground">
                            We offer competitive benefits and a supportive work environment
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                                            {benefit.icon}
                                        </div>
                                        <CardTitle>{benefit.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{benefit.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
                        <p className="text-muted-foreground mb-8">
                            Find your next opportunity
                        </p>
                        
                        {/* Department Filter */}
                        <Tabs defaultValue="all" className="mb-8">
                            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                                <TabsTrigger 
                                    value="all"
                                    onClick={() => setSelectedDepartment('all')}
                                >
                                    All
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="engineering"
                                    onClick={() => setSelectedDepartment('engineering')}
                                >
                                    Engineering
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="product"
                                    onClick={() => setSelectedDepartment('product')}
                                >
                                    Product
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="design"
                                    onClick={() => setSelectedDepartment('design')}
                                >
                                    Design
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="space-y-6 max-w-4xl mx-auto">
                        {filteredPositions.map((position, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="mb-2">{position.title}</CardTitle>
                                                <div className="flex gap-2">
                                                    <Badge variant="secondary">{position.department}</Badge>
                                                    <Badge variant="outline">{position.location}</Badge>
                                                    <Badge>{position.type}</Badge>
                                                </div>
                                            </div>
                                            <Button>Apply Now</Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{position.description}</p>
                                        <div>
                                            <h4 className="font-semibold mb-2">Requirements:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                {position.requirements.map((req, i) => (
                                                    <li key={i}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
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
                        <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
                        <p className="text-xl opacity-90 mb-8">
                            We're always looking for talented individuals to join our team
                        </p>
                        <Button size="lg" variant="secondary">
                            Send Us Your Resume
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Careers;
