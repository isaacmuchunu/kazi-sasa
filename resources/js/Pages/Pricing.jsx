import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Pricing({ plans = [] }) {
    const [billingPeriod, setBillingPeriod] = useState('monthly');

    const defaultPlans = plans.length > 0 ? plans : [
        {
            name: 'Basic',
            price: 0,
            period: 'month',
            description: 'Perfect for small businesses starting their hiring journey',
            features: [
                'Post up to 3 jobs per month',
                'Basic job listing visibility',
                'Email support',
                'Job posting valid for 30 days',
                'Basic candidate search',
                'Standard job templates'
            ],
            highlighted: false,
            buttonText: 'Get Started',
            color: 'gray'
        },
        {
            name: 'Professional',
            price: 49,
            period: 'month',
            description: 'Ideal for growing companies with regular hiring needs',
            features: [
                'Post unlimited jobs',
                'Featured job listings',
                'Priority support',
                'Advanced analytics & insights',
                'Job posting valid for 60 days',
                'Advanced candidate search',
                'Custom job templates',
                'Company profile customization',
                'Email notifications',
                'Resume database access'
            ],
            highlighted: true,
            buttonText: 'Start Free Trial',
            color: 'blue'
        },
        {
            name: 'Enterprise',
            price: 99,
            period: 'month',
            description: 'Comprehensive solution for large organizations',
            features: [
                'Everything in Professional',
                'Custom branding & white-label',
                'Dedicated account manager',
                'API access & integrations',
                'Job posting valid for 90 days',
                'Advanced reporting & analytics',
                'Multiple user accounts',
                'Candidate tracking system',
                'Custom integrations',
                'Priority job placement',
                '24/7 phone support',
                'Custom contract terms'
            ],
            highlighted: false,
            buttonText: 'Contact Sales',
            color: 'purple'
        }
    ];

    const getColorClasses = (color, highlighted) => {
        if (highlighted) {
            return {
                border: 'border-blue-500 dark:border-blue-400',
                badge: 'bg-blue-600 text-white',
                button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50',
                icon: 'text-blue-600 dark:text-blue-400',
                gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
            };
        }
        return {
            border: 'border-gray-200 dark:border-gray-700',
            badge: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            button: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600',
            icon: 'text-gray-600 dark:text-gray-400',
            gradient: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'
        };
    };

    const features = [
        {
            icon: 'bx-briefcase',
            title: 'Smart Job Posting',
            description: 'Create and publish job listings in minutes with our intuitive interface'
        },
        {
            icon: 'bx-search-alt',
            title: 'Advanced Candidate Search',
            description: 'Find the perfect candidates using powerful filters and search tools'
        },
        {
            icon: 'bx-line-chart',
            title: 'Analytics Dashboard',
            description: 'Track your job posting performance with detailed analytics'
        },
        {
            icon: 'bx-support',
            title: 'Dedicated Support',
            description: 'Get help from our expert support team whenever you need it'
        }
    ];

    return (
        <AppLayout title="Pricing Plans">
            <Head>
                <meta name="description" content="Choose the perfect pricing plan for your hiring needs. Flexible options for businesses of all sizes." />
            </Head>

            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-900 py-20 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Choose the perfect plan for your hiring needs. No hidden fees, cancel anytime.
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-2">
                            <button
                                onClick={() => setBillingPeriod('monthly')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                    billingPeriod === 'monthly'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400'
                                }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingPeriod('yearly')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                    billingPeriod === 'yearly'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400'
                                }`}
                            >
                                Yearly
                                <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                                    Save 20%
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {defaultPlans.map((plan, index) => {
                            const colors = getColorClasses(plan.color, plan.highlighted);
                            const price = billingPeriod === 'yearly' ? Math.floor(plan.price * 12 * 0.8) : plan.price;

                            return (
                                <div
                                    key={index}
                                    className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border-2 ${colors.border} ${
                                        plan.highlighted ? 'shadow-2xl scale-105 relative' : 'shadow-lg'
                                    } transition-all duration-300 hover:shadow-xl`}
                                >
                                    {plan.highlighted && (
                                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-xl">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className={`bg-gradient-to-br ${colors.gradient} p-8 border-b border-gray-200 dark:border-gray-700`}>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {plan.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            {plan.description}
                                        </p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-bold text-gray-900 dark:text-white">
                                                ${price}
                                            </span>
                                            {plan.price > 0 && (
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    /{billingPeriod === 'yearly' ? 'year' : plan.period}
                                                </span>
                                            )}
                                        </div>
                                        {billingPeriod === 'yearly' && plan.price > 0 && (
                                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                                Save ${plan.price * 12 - price} per year
                                            </p>
                                        )}
                                    </div>

                                    <div className="p-8">
                                        <ul className="space-y-4 mb-8">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-3">
                                                    <i className={`bx bx-check-circle text-xl ${colors.icon} flex-shrink-0 mt-0.5`}></i>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${colors.button}`}
                                        >
                                            {plan.buttonText}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Everything You Need to Hire Successfully
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Our platform comes packed with powerful features to streamline your hiring process.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                            >
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className={`bx ${feature.icon} text-3xl text-blue-600 dark:text-blue-400`}></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            {[
                                {
                                    question: 'Can I change plans later?',
                                    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
                                },
                                {
                                    question: 'What payment methods do you accept?',
                                    answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
                                },
                                {
                                    question: 'Is there a free trial?',
                                    answer: 'Yes, we offer a 14-day free trial for the Professional plan. No credit card required.'
                                },
                                {
                                    question: 'What happens if I exceed my job posting limit?',
                                    answer: 'You can either upgrade your plan or purchase additional job posting credits as needed.'
                                }
                            ].map((faq, index) => (
                                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of companies who trust Kazi Sasa to find their next great hire.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-xl"
                        >
                            Start Free Trial
                            <i className="bx bx-right-arrow-alt text-xl"></i>
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}