import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";

const TermsOfService = () => {
    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: `By accessing and using ProPlow's services ("Services"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
        },
        {
            title: "2. Description of Service",
            content: `ProPlow provides a project management and team collaboration platform. The service includes various features such as task management, team collaboration tools, file sharing, and analytics, subject to change at our discretion.`
        },
        {
            title: "3. Registration and Account Security",
            content: `To access the Services, you must create an account. You agree to:
            - Provide accurate information
            - Maintain the security of your account
            - Promptly update any changes to your information
            - Accept responsibility for all activities under your account`
        },
        {
            title: "4. User Conduct",
            content: `You agree not to:
            - Violate any laws or regulations
            - Impersonate any person or entity
            - Interfere with the operation of the Services
            - Upload malicious code or content
            - Attempt to gain unauthorized access`
        },
        {
            title: "5. Intellectual Property Rights",
            content: `The Services and its original content, features, and functionality are owned by ProPlow and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.`
        },
        {
            title: "6. Payment Terms",
            content: `For paid subscriptions:
            - Fees are billed in advance
            - No refunds for partial months
            - Automatic renewal unless cancelled
            - Price changes with 30 days notice`
        },
        {
            title: "7. Data Privacy",
            content: `We collect and process personal data as described in our Privacy Policy. By using our Services, you agree to our data practices as described in the Privacy Policy.`
        },
        {
            title: "8. Termination",
            content: `We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason, including breach of these Terms.`
        },
        {
            title: "9. Limitation of Liability",
            content: `To the maximum extent permitted by law, ProPlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Services.`
        },
        {
            title: "10. Changes to Terms",
            content: `We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Services.`
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
                            Terms of Service
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            Last updated: December 15, 2023
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    These Terms of Service ("Terms") govern your access to and use of ProPlow's website,
                                    products, and services. Please read these Terms carefully before using our Services.
                                    By using our Services, you agree to be bound by these Terms.
                                </p>
                            </CardContent>
                        </Card>

                        <Accordion type="single" collapsible className="space-y-4">
                            {sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <AccordionItem value={`item-${index}`}>
                                        <AccordionTrigger className="text-lg font-semibold">
                                            {section.title}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground whitespace-pre-line">
                                            {section.content}
                                        </AccordionContent>
                                    </AccordionItem>
                                </motion.div>
                            ))}
                        </Accordion>

                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Contact Us</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about these Terms, please contact us at:
                                </p>
                                <p className="text-muted-foreground">
                                    Email: legal@proplow.com<br />
                                    Address: 123 Business Street, San Francisco, CA 94105<br />
                                    Phone: +1 (555) 000-0000
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
                        <p className="text-muted-foreground mb-8">
                            Our legal team is here to help you understand our terms
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button>Contact Support</Button>
                            <Button variant="outline">View FAQ</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsOfService;
