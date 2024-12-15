import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";

const PrivacyPolicy = () => {
    const sections = [
        {
            title: "Information We Collect",
            content: "We collect information you provide directly to us, including but not limited to your name, email address, and any other information you choose to provide. We also automatically collect certain information about your device when you use our services."
        },
        {
            title: "How We Use Your Information",
            content: "We use the information we collect to provide, maintain, and improve our services, to develop new features, and to protect ProPlow and our users. We also use the information to communicate with you about your account and updates to our services."
        },
        {
            title: "Information Sharing",
            content: "We do not share your personal information with third parties except as described in this Privacy Policy. We may share your information with third-party service providers who assist us in providing our services."
        },
        {
            title: "Data Security",
            content: "We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable and we cannot guarantee the security of our systems 100%."
        },
        {
            title: "Your Rights",
            content: "You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your information. To exercise these rights, please contact us through the provided channels."
        },
        {
            title: "Updates to This Policy",
            content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date at the top of this Policy."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8"
        >
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
                    <CardDescription>Last updated: December 15, 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-300">
                        At ProPlow, we take your privacy seriously. This Privacy Policy explains how we collect,
                        use, disclose, and safeguard your information when you use our service.
                    </p>

                    <Accordion type="single" collapsible>
                        {sections.map((section, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-lg font-semibold">
                                    {section.title}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 dark:text-gray-300">
                                    {section.content}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-8 space-y-4">
                        <h3 className="text-xl font-semibold">Contact Us</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                            <li>Email: privacy@proplow.com</li>
                            <li>Address: 123 Privacy Street, Tech City, TC 12345</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default PrivacyPolicy;
