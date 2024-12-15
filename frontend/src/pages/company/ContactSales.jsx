import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactSales = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8 mt-16"
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold">Contact Sales</CardTitle>
                                <CardDescription>
                                    Get in touch with our sales team to learn more about ProPlow's enterprise solutions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your.email@company.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company</Label>
                                        <Input
                                            id="company"
                                            placeholder="Your company name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us about your needs..."
                                            className="min-h-[150px]"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                            <p className="text-muted-foreground">
                                Our sales team is here to help you find the perfect solution for your business.
                                We typically respond within 24 hours.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="mt-1">
                                    <FaEnvelope className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email Us</h3>
                                    <p className="text-muted-foreground">avijitdam003@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="mt-1">
                                    <FaPhone className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Call Us</h3>
                                    <p className="text-muted-foreground">+91 95931 89913</p>
                                    <p className="text-muted-foreground">+91 99329 64421</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="mt-1">
                                    <FaMapMarkerAlt className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Visit Us</h3>
                                    <p className="text-muted-foreground">
                                        123 Business Avenue<br />
                                        Suite 100<br />
                                        New York, NY 10001
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <h3 className="font-semibold mb-4">Enterprise Solutions</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>• Custom deployment options</li>
                                <li>• Advanced security features</li>
                                <li>• Dedicated account manager</li>
                                <li>• Priority support</li>
                                <li>• Custom integrations</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactSales;
