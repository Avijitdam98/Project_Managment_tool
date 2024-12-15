import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { FaRocket, FaBug, FaWrench, FaShieldAlt } from 'react-icons/fa';

const Changelog = () => {
    const releases = [
        {
            version: "2.4.0",
            date: "December 15, 2023",
            type: "major",
            highlights: [
                "New analytics dashboard with customizable widgets",
                "Enhanced team collaboration features",
                "Improved project timeline visualization",
                "Advanced filtering and sorting options"
            ],
            changes: {
                features: [
                    "Added drag-and-drop file upload support",
                    "Implemented real-time collaboration in documents",
                    "Added dark mode support across all pages",
                    "Introduced new keyboard shortcuts"
                ],
                improvements: [
                    "Optimized page load performance by 40%",
                    "Enhanced mobile responsiveness",
                    "Updated UI components for better accessibility"
                ],
                fixes: [
                    "Fixed issue with task assignment notifications",
                    "Resolved calendar sync problems",
                    "Fixed data export formatting"
                ]
            }
        },
        {
            version: "2.3.2",
            date: "December 1, 2023",
            type: "patch",
            highlights: [
                "Security updates and bug fixes",
                "Performance improvements"
            ],
            changes: {
                features: [],
                improvements: [
                    "Improved error handling and logging",
                    "Updated third-party dependencies"
                ],
                fixes: [
                    "Fixed authentication token refresh issue",
                    "Resolved memory leak in real-time updates"
                ]
            }
        },
        {
            version: "2.3.0",
            date: "November 15, 2023",
            type: "minor",
            highlights: [
                "New integration capabilities",
                "Enhanced reporting features"
            ],
            changes: {
                features: [
                    "Added Microsoft Teams integration",
                    "Implemented custom report builder",
                    "Added project templates feature"
                ],
                improvements: [
                    "Enhanced search functionality",
                    "Improved data import/export options"
                ],
                fixes: [
                    "Fixed issues with file preview",
                    "Resolved notification delivery delays"
                ]
            }
        }
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case "major":
                return <FaRocket className="w-5 h-5" />;
            case "minor":
                return <FaWrench className="w-5 h-5" />;
            case "patch":
                return <FaBug className="w-5 h-5" />;
            default:
                return <FaShieldAlt className="w-5 h-5" />;
        }
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case "major":
                return <Badge className="bg-primary">Major Release</Badge>;
            case "minor":
                return <Badge variant="secondary">Minor Release</Badge>;
            case "patch":
                return <Badge variant="outline">Patch</Badge>;
            default:
                return <Badge variant="outline">Update</Badge>;
        }
    };

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
                            Product Changelog
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            Keep track of what's new in ProPlow
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-center gap-4"
                        >
                            <Button>Subscribe to Updates</Button>
                            <Button variant="outline">View Release Notes</Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Releases Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {releases.map((release, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="mb-12"
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    {getTypeIcon(release.type)}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-2xl">Version {release.version}</CardTitle>
                                                    <CardDescription>{release.date}</CardDescription>
                                                </div>
                                            </div>
                                            {getTypeBadge(release.type)}
                                        </div>
                                        {release.highlights.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="font-semibold">Highlights:</h3>
                                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                    {release.highlights.map((highlight, i) => (
                                                        <li key={i}>{highlight}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {release.changes.features.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                        <FaRocket className="text-primary" /> New Features
                                                    </h3>
                                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                        {release.changes.features.map((feature, i) => (
                                                            <li key={i}>{feature}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {release.changes.improvements.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                        <FaWrench className="text-primary" /> Improvements
                                                    </h3>
                                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                        {release.changes.improvements.map((improvement, i) => (
                                                            <li key={i}>{improvement}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {release.changes.fixes.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                        <FaBug className="text-primary" /> Bug Fixes
                                                    </h3>
                                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                        {release.changes.fixes.map((fix, i) => (
                                                            <li key={i}>{fix}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subscribe Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                        <p className="text-muted-foreground mb-8">
                            Subscribe to our release notes to get notified about new updates
                        </p>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <h3 className="font-semibold mb-2">Release Notes</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Detailed documentation of changes
                                        </p>
                                        <Button variant="outline">View Notes</Button>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-semibold mb-2">RSS Feed</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Subscribe via RSS
                                        </p>
                                        <Button variant="outline">Get Feed</Button>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-semibold mb-2">Email Updates</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Get updates in your inbox
                                        </p>
                                        <Button variant="outline">Subscribe</Button>
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

export default Changelog;
