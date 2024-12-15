import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { FaCheck, FaInfoCircle } from 'react-icons/fa';

const plans = [
    {
        name: "Free",
        description: "For individuals and small teams getting started",
        price: { monthly: 0, annual: 0 },
        features: [
            "Up to 5 team members",
            "3 active projects",
            "Basic task management",
            "File sharing (100MB)",
            "Community support"
        ],
        popular: false,
        buttonText: "Get Started",
        buttonVariant: "outline"
    },
    {
        name: "Pro",
        description: "For growing teams that need more power",
        price: { monthly: 12, annual: 10 },
        features: [
            "Up to 50 team members",
            "Unlimited projects",
            "Advanced task management",
            "File sharing (10GB)",
            "Priority support",
            "Custom fields",
            "Time tracking",
            "Advanced analytics"
        ],
        popular: true,
        buttonText: "Start Free Trial",
        buttonVariant: "default"
    },
    {
        name: "Enterprise",
        description: "For large organizations with specific needs",
        price: { monthly: 29, annual: 24 },
        features: [
            "Unlimited team members",
            "Unlimited projects",
            "Enterprise security",
            "Unlimited storage",
            "24/7 phone support",
            "Custom integrations",
            "API access",
            "Dedicated success manager",
            "SAML SSO",
            "Custom contract"
        ],
        popular: false,
        buttonText: "Contact Sales",
        buttonVariant: "outline"
    }
];

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/10 to-background">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                        >
                            Simple, Transparent Pricing
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            Choose the perfect plan for your team's needs
                        </motion.p>

                        {/* Billing Toggle */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-4 mb-12"
                        >
                            <span className={!isAnnual ? 'text-foreground' : 'text-muted-foreground'}>Monthly</span>
                            <Switch
                                checked={isAnnual}
                                onCheckedChange={setIsAnnual}
                            />
                            <span className={isAnnual ? 'text-foreground' : 'text-muted-foreground'}>
                                Annual
                                <Badge variant="secondary" className="ml-2">Save 20%</Badge>
                            </span>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className={`relative h-full hover:shadow-lg transition-all duration-300 ${
                                    plan.popular ? 'border-primary' : ''
                                }`}>
                                    {plan.popular && (
                                        <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle>{plan.name}</CardTitle>
                                        <CardDescription>{plan.description}</CardDescription>
                                        <div className="mt-4">
                                            <span className="text-4xl font-bold">
                                                ${isAnnual ? plan.price.annual : plan.price.monthly}
                                            </span>
                                            <span className="text-muted-foreground">/month</span>
                                            {isAnnual && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Billed annually
                                                </p>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button 
                                            className="w-full" 
                                            variant={plan.buttonVariant}
                                        >
                                            {plan.buttonText}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-muted-foreground">
                            Have questions? We're here to help
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                q: "Can I change my plan later?",
                                a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers."
                            },
                            {
                                q: "Do you offer a free trial?",
                                a: "Yes, all paid plans come with a 14-day free trial. No credit card required."
                            },
                            {
                                q: "What happens when my trial ends?",
                                a: "You can choose to upgrade to a paid plan or continue with the free plan with limited features."
                            }
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{faq.q}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{faq.a}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise CTA */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
                        <p className="text-xl opacity-90 mb-8">
                            Let's discuss how ProPlow can be tailored to your organization's specific needs
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" variant="secondary">
                                Contact Sales
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent hover:bg-primary-foreground/10">
                                View Enterprise Features
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Pricing;
