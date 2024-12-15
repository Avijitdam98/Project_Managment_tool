import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { FaRocket, FaUsers, FaChartLine, FaLock } from 'react-icons/fa';

const StartTrial = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    const features = [
        {
            icon: <FaRocket />,
            title: "Full Access",
            description: "Try all premium features for 14 days"
        },
        {
            icon: <FaUsers />,
            title: "Team Collaboration",
            description: "Invite up to 10 team members"
        },
        {
            icon: <FaChartLine />,
            title: "Analytics",
            description: "Track your team's performance"
        },
        {
            icon: <FaLock />,
            title: "Secure",
            description: "Enterprise-grade security"
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
                            Start Your Free Trial Today
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            14 days of unlimited access. No credit card required.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Trial Form Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Trial Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Create Your Account</CardTitle>
                                    <CardDescription>
                                        Get started with ProPlow in minutes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" placeholder="John" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" placeholder="Doe" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="workEmail">Work Email</Label>
                                            <Input 
                                                id="workEmail" 
                                                type="email" 
                                                placeholder="john@company.com" 
                                                required 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input 
                                                id="password" 
                                                type="password" 
                                                placeholder="Create a secure password" 
                                                required 
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Must be at least 8 characters
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="company">Company Name</Label>
                                            <Input id="company" placeholder="Your Company" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="teamSize">Team Size</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select team size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1-5">1-5 team members</SelectItem>
                                                    <SelectItem value="6-10">6-10 team members</SelectItem>
                                                    <SelectItem value="11-25">11-25 team members</SelectItem>
                                                    <SelectItem value="26-50">26-50 team members</SelectItem>
                                                    <SelectItem value="51+">51+ team members</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-start space-x-2">
                                            <Checkbox id="terms" />
                                            <div className="grid gap-1.5 leading-none">
                                                <label
                                                    htmlFor="terms"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Accept terms and conditions
                                                </label>
                                                <p className="text-sm text-muted-foreground">
                                                    By creating an account, you agree to our{" "}
                                                    <a href="/terms" className="underline">Terms of Service</a>
                                                    {" "}and{" "}
                                                    <a href="/privacy" className="underline">Privacy Policy</a>
                                                </p>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full">
                                            Start Free Trial
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Trial Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-8"
                        >
                            <div>
                                <h3 className="text-2xl font-semibold mb-6">What's Included in Your Trial</h3>
                                <div className="grid gap-6">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                {feature.icon}
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-semibold">{feature.title}</h4>
                                                <p className="text-muted-foreground">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>What Happens After the Trial?</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground">
                                        After your 14-day trial:
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                                            Choose to upgrade to a paid plan
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                                            Continue with limited features on free plan
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                                            No commitment required
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Need Help Getting Started?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-4">
                                        Our team is here to help you make the most of your trial
                                    </p>
                                    <Button variant="outline" className="w-full">
                                        Schedule a Demo
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
                        <p className="text-muted-foreground">
                            Join thousands of satisfied teams using ProPlow
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                quote: "ProPlow has transformed how our team collaborates. The trial period convinced us immediately.",
                                author: "Sarah Johnson",
                                role: "Project Manager, TechCorp"
                            },
                            {
                                quote: "The onboarding process was smooth, and the support team was incredibly helpful.",
                                author: "Michael Chen",
                                role: "CTO, StartupX"
                            },
                            {
                                quote: "We saw immediate improvements in our team's productivity after implementing ProPlow.",
                                author: "Emily Rodriguez",
                                role: "Team Lead, InnovateNow"
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                                        <div>
                                            <p className="font-semibold">{testimonial.author}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StartTrial;
