import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FaRocket, FaUsers, FaGlobe, FaAward } from 'react-icons/fa';

const About = () => {
    const stats = [
        { number: "1M+", label: "Active Users" },
        { number: "50K+", label: "Companies" },
        { number: "120+", label: "Countries" },
        { number: "99.9%", label: "Uptime" }
    ];

    const values = [
        {
            icon: <FaRocket />,
            title: "Innovation",
            description: "We constantly push boundaries to create cutting-edge solutions."
        },
        {
            icon: <FaUsers />,
            title: "Customer First",
            description: "Our customers' success is our top priority."
        },
        {
            icon: <FaGlobe />,
            title: "Global Impact",
            description: "Making project management accessible worldwide."
        },
        {
            icon: <FaAward />,
            title: "Excellence",
            description: "Committed to delivering the highest quality in everything we do."
        }
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "CEO & Co-founder",
            image: "https://ui-avatars.com/api/?name=Sarah+Johnson",
            bio: "15+ years of experience in tech leadership"
        },
        {
            name: "Michael Chen",
            role: "CTO & Co-founder",
            image: "https://ui-avatars.com/api/?name=Michael+Chen",
            bio: "Former lead engineer at major tech companies"
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Product",
            image: "https://ui-avatars.com/api/?name=Emily+Rodriguez",
            bio: "Product visionary with UX expertise"
        },
        {
            name: "David Kim",
            role: "Head of Engineering",
            image: "https://ui-avatars.com/api/?name=David+Kim",
            bio: "Scaling systems for enterprise clients"
        }
    ];

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
                            Our Mission is to Transform Project Management
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            We're building the future of team collaboration and project delivery
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    Founded in 2020, ProPlow emerged from a simple observation: project management 
                                    tools were either too complex or too simple for modern teams.
                                </p>
                                <p className="text-muted-foreground">
                                    Our founders, Sarah and Michael, experienced firsthand the challenges of 
                                    managing distributed teams and complex projects. They set out to create a 
                                    solution that would make project management both powerful and intuitive.
                                </p>
                                <p className="text-muted-foreground">
                                    Today, ProPlow helps thousands of teams across the globe deliver projects 
                                    more efficiently while maintaining clarity and control.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[400px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg"
                        >
                            {/* Add company image or illustration here */}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                        <p className="text-muted-foreground">
                            The principles that guide everything we do
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
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
                                            {value.icon}
                                        </div>
                                        <CardTitle>{value.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
                        <p className="text-muted-foreground">
                            Meet the people driving ProPlow forward
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="text-center">
                                            <img 
                                                src={member.image} 
                                                alt={member.name}
                                                className="w-24 h-24 rounded-full mx-auto mb-4"
                                            />
                                            <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                                            <p className="text-primary mb-2">{member.role}</p>
                                            <p className="text-sm text-muted-foreground">{member.bio}</p>
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
                        <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
                        <p className="text-xl opacity-90 mb-8">
                            Be part of the future of project management
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" variant="secondary">
                                View Open Positions
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent hover:bg-primary-foreground/10">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
