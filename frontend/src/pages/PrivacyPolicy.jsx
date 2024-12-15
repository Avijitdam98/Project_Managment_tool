import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { FaShieldAlt, FaUserLock, FaDatabase, FaCookies } from 'react-icons/fa';

const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: December 15, 2024</p>
                </div>

                {/* Introduction */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <FaShieldAlt className="w-6 h-6 text-primary" />
                            <CardTitle>Introduction</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <p>
                            At ProPlow, we take your privacy seriously. This Privacy Policy explains how we collect,
                            use, disclose, and safeguard your information when you use our project management platform.
                            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
                            please do not access the application.
                        </p>
                    </CardContent>
                </Card>

                {/* Information We Collect */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <FaUserLock className="w-6 h-6 text-primary" />
                            <CardTitle>Information We Collect</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none space-y-4">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Name and email address when you create an account</li>
                            <li>Profile information you provide</li>
                            <li>Payment information when subscribing to our premium services</li>
                            <li>Communications between you and ProPlow</li>
                        </ul>

                        <h3 className="text-lg font-semibold">Usage Information</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Log data (IP address, browser type, pages visited)</li>
                            <li>Device information</li>
                            <li>Location information</li>
                            <li>Project and task data you create</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* How We Use Your Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <FaDatabase className="w-6 h-6 text-primary" />
                            <CardTitle>How We Use Your Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To provide and maintain our Service</li>
                            <li>To notify you about changes to our Service</li>
                            <li>To provide customer support</li>
                            <li>To gather analysis or valuable information to improve our Service</li>
                            <li>To monitor the usage of our Service</li>
                            <li>To detect, prevent and address technical issues</li>
                            <li>To fulfill any other purpose for which you provide it</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Cookies */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <FaCookies className="w-6 h-6 text-primary" />
                            <CardTitle>Cookies and Tracking</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <p>
                            We use cookies and similar tracking technologies to track activity on our Service and 
                            hold certain information. Cookies are files with small amount of data which may include 
                            an anonymous unique identifier.
                        </p>
                        <p className="mt-4">
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            However, if you do not accept cookies, you may not be able to use some portions of our Service.
                        </p>
                    </CardContent>
                </Card>

                {/* Contact Section */}
                <Card>
                    <CardContent className="py-6">
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold">Have questions about our Privacy Policy?</h3>
                            <p className="text-muted-foreground">
                                Contact us at privacy@proplow.com or visit our help center.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Button asChild variant="outline">
                                    <Link to="/contact">Contact Us</Link>
                                </Button>
                                <Button asChild>
                                    <Link to="/help">Help Center</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>© 2024 ProPlow. All rights reserved.</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <Link to="/terms" className="hover:underline">Terms of Service</Link>
                        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                        <Link to="/cookies" className="hover:underline">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
