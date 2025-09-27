import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function About() {
    return (
        <AppLayout title="About Us">
            <Head>
                <meta name="description" content="Learn about Kazi Sasa - Kenya's leading job portal connecting talented professionals with top employers." />
            </Head>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        About Kazi Sasa
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        We're Kenya's leading job portal, connecting talented professionals with top employers across all industries.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="/assets/img/about.jpg"
                                alt="About Kazi Sasa"
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Our Mission
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                                To bridge the gap between talented job seekers and forward-thinking employers by providing an innovative, user-friendly platform that facilitates meaningful career connections.
                            </p>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Our Vision
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                To become the most trusted and comprehensive career platform in East Africa, empowering millions of professionals to achieve their career aspirations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
                            <div className="text-gray-600 dark:text-gray-400">Jobs Posted</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">2K+</div>
                            <div className="text-gray-600 dark:text-gray-400">Companies</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
                            <div className="text-gray-600 dark:text-gray-400">Job Seekers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-yellow-600 mb-2">95%</div>
                            <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Why Choose Kazi Sasa?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Discover what makes us the preferred choice for job seekers and employers across Kenya.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: 'bx-search',
                                title: 'Smart Job Matching',
                                description: 'Our advanced algorithm matches you with jobs that align with your skills and preferences.'
                            },
                            {
                                icon: 'bx-shield-check',
                                title: 'Verified Companies',
                                description: 'All companies on our platform are verified to ensure legitimate job opportunities.'
                            },
                            {
                                icon: 'bx-support',
                                title: '24/7 Support',
                                description: 'Our dedicated support team is available round the clock to assist you.'
                            },
                            {
                                icon: 'bx-mobile',
                                title: 'Mobile Friendly',
                                description: 'Access opportunities anywhere, anytime with our mobile-optimized platform.'
                            },
                            {
                                icon: 'bx-bolt',
                                title: 'Quick Apply',
                                description: 'Apply to multiple jobs quickly with our streamlined application process.'
                            },
                            {
                                icon: 'bx-trending-up',
                                title: 'Career Growth',
                                description: 'Access resources and opportunities to advance your career to the next level.'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className={`bx ${feature.icon} text-2xl text-blue-600 dark:text-blue-400`}></i>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-blue-600 dark:bg-blue-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of professionals who have found their dream jobs with Kazi Sasa.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Get Started Today
                        </Link>
                        <Link
                            href="/jobs"
                            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}