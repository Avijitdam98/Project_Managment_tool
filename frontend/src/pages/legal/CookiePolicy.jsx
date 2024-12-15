import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const CookiePolicy = () => {
    const cookieTypes = [
        {
            type: "Essential Cookies",
            purpose: "These cookies are necessary for the website to function and cannot be switched off in our systems.",
            duration: "Session - 1 year",
            examples: [
                "Authentication tokens",
                "Security cookies",
                "Load balancing session"
            ]
        },
        {
            type: "Performance Cookies",
            purpose: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
            duration: "1 day - 2 years",
            examples: [
                "Google Analytics",
                "Page load timings",
                "Error logging"
            ]
        },
        {
            type: "Functional Cookies",
            purpose: "These cookies enable the website to provide enhanced functionality and personalization.",
            duration: "Session - 2 years",
            examples: [
                "Language preferences",
                "User settings",
                "Live chat services"
            ]
        },
        {
            type: "Targeting Cookies",
            purpose: "These cookies may be set through our site by our advertising partners to build a profile of your interests.",
            duration: "30 days - 1 year",
            examples: [
                "Advertisement preferences",
                "Social sharing cookies",
                "Marketing tracking"
            ]
        }
    ];

    const faqs = [
        {
            question: "What are cookies?",
            answer: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide useful information to website owners."
        },
        {
            question: "How do we use cookies?",
            answer: "We use cookies to understand how you use our website, to remember your preferences, and to improve your experience. This includes remembering your login details, language preferences, and analyzing how you use our site."
        },
        {
            question: "How can you control cookies?",
            answer: "You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site."
        },
        {
            question: "Do we use third-party cookies?",
            answer: "Yes, we use some third-party cookies for analytics, advertising, and social media integration. These cookies are subject to their respective privacy policies, and we encourage you to review them."
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
                            Cookie Policy
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

            {/* Overview Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="mb-12">
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    This Cookie Policy explains how ProPlow ("we", "us", and "our") uses cookies and 
                                    similar technologies to recognize you when you visit our website. It explains 
                                    what these technologies are and why we use them, as well as your rights to 
                                    control our use of them.
                                </p>
                                <p className="text-muted-foreground">
                                    By continuing to use our site, you are agreeing to our use of cookies as 
                                    described in this policy.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Cookie Types Table */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">Types of Cookies We Use</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Examples</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cookieTypes.map((cookie, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{cookie.type}</TableCell>
                                            <TableCell>{cookie.purpose}</TableCell>
                                            <TableCell>{cookie.duration}</TableCell>
                                            <TableCell>
                                                <ul className="list-disc list-inside">
                                                    {cookie.examples.map((example, i) => (
                                                        <li key={i}>{example}</li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* FAQs */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                        {/* Managing Cookies */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Managing Your Cookie Preferences</CardTitle>
                                <CardDescription>
                                    You can manage your cookie preferences at any time
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    Most web browsers allow some control of most cookies through the browser 
                                    settings. To find out more about cookies, including how to see what cookies 
                                    have been set, visit www.aboutcookies.org or www.allaboutcookies.org.
                                </p>
                                <Button>Manage Cookie Preferences</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Questions About Our Cookie Policy?</h2>
                        <p className="text-muted-foreground mb-8">
                            If you have any questions about our use of cookies or other technologies, please 
                            contact us at:
                        </p>
                        <div className="space-y-2 mb-8">
                            <p>Email: privacy@proplow.com</p>
                            <p>Phone: +1 (555) 000-0000</p>
                            <p>Address: 123 Business Street, San Francisco, CA 94105</p>
                        </div>
                        <Button>Contact Privacy Team</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CookiePolicy;
