import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FaShieldAlt, FaLock, FaUserShield, FaServer, FaCloudDownloadAlt, FaFileAlt, FaBug, FaUserSecret } from 'react-icons/fa';

const Security = () => {
    const securityFeatures = [
        {
            icon: <FaLock />,
            title: "Data Encryption",
            description: "All data is encrypted in transit and at rest using industry-standard protocols"
        },
        {
            icon: <FaUserShield />,
            title: "Access Control",
            description: "Role-based access control and multi-factor authentication"
        },
        {
            icon: <FaServer />,
            title: "Infrastructure Security",
            description: "Regular security audits and penetration testing"
        },
        {
            icon: <FaCloudDownloadAlt />,
            title: "Backup & Recovery",
            description: "Automated backups and disaster recovery procedures"
        }
    ];

    const certifications = [
        {
            title: "SOC 2 Type II",
            description: "Certified for security, availability, and confidentiality"
        },
        {
            title: "ISO 27001",
            description: "Information security management system certification"
        },
        {
            title: "GDPR Compliant",
            description: "Adherence to EU data protection regulations"
        },
        {
            title: "HIPAA Compliant",
            description: "Healthcare data protection standards"
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
                            Security at ProPlow
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            Your security and privacy are our top priorities
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Button size="lg">Download Security Whitepaper</Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Security Features */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h2>
                        <p className="text-muted-foreground">
                            Protecting your data with industry-leading security measures
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {securityFeatures.map((feature, index) => (
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
                                            {feature.icon}
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Certifications & Compliance</h2>
                        <p className="text-muted-foreground">
                            Meeting and exceeding industry standards
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {certifications.map((cert, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{cert.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{cert.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Practices */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Our Security Practices</h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4">
                                        <FaFileAlt />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Regular Audits</h3>
                                        <p className="text-muted-foreground">
                                            We conduct regular security audits and penetration testing to identify 
                                            and address potential vulnerabilities.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4">
                                        <FaBug />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Bug Bounty Program</h3>
                                        <p className="text-muted-foreground">
                                            We maintain an active bug bounty program to encourage responsible 
                                            disclosure of security vulnerabilities.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4">
                                        <FaUserSecret />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Employee Training</h3>
                                        <p className="text-muted-foreground">
                                            All employees undergo regular security awareness training and 
                                            follow strict security protocols.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Resources</CardTitle>
                                    <CardDescription>
                                        Learn more about our security measures and practices
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button variant="outline" className="w-full justify-start">
                                        <FaFileAlt className="mr-2" /> Security Whitepaper
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <FaShieldAlt className="mr-2" /> Compliance Documentation
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <FaBug className="mr-2" /> Bug Bounty Program
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <FaUserSecret className="mr-2" /> Privacy Policy
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Have Security Concerns?</h2>
                        <p className="text-xl opacity-90 mb-8">
                            Our security team is here to help
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" variant="secondary">
                                Contact Security Team
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent hover:bg-primary-foreground/10">
                                Report Vulnerability
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Security;
