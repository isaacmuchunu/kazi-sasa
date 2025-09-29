import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function FAQ({ faqs = [] }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const defaultFaqs = faqs.length > 0 ? faqs : [
        {
            question: 'How do I create an account?',
            answer: 'Click on the "Register" button in the top navigation and fill out the required information. Choose whether you\'re a job seeker or employer, and complete your profile to get started.'
        },
        {
            question: 'Is it free to use Kazi Sasa?',
            answer: 'Yes, creating an account and applying for jobs is completely free for job seekers. Employers have access to various pricing plans based on their hiring needs.'
        },
        {
            question: 'How do I post a job?',
            answer: 'Employers can post jobs by creating an employer account and using our job posting feature. Navigate to your dashboard and click on "Post a Job" to get started.'
        },
        {
            question: 'Can I apply for multiple jobs?',
            answer: 'Yes, you can apply for as many jobs as you like. We recommend tailoring your application for each position to increase your chances of success.'
        },
        {
            question: 'How do I edit my profile?',
            answer: 'Log in to your account and navigate to your profile settings. You can update your personal information, work experience, education, and skills at any time.'
        },
        {
            question: 'How can I track my job applications?',
            answer: 'All your job applications can be tracked from your dashboard. You\'ll see the status of each application and receive notifications when employers respond.'
        },
        {
            question: 'What is a featured job?',
            answer: 'Featured jobs appear at the top of search results and get more visibility. Employers can choose to feature their job postings for better reach.'
        },
        {
            question: 'How do employers contact me?',
            answer: 'Employers can contact you through our platform messaging system or via the contact information you provide in your profile and resume.'
        },
        {
            question: 'Can I save jobs to apply later?',
            answer: 'Yes, you can save jobs by clicking the bookmark icon on any job listing. Access your saved jobs anytime from your dashboard.'
        },
        {
            question: 'How do I delete my account?',
            answer: 'You can delete your account from your profile settings. Please note that this action is permanent and all your data will be removed from our system.'
        },
        {
            question: 'Do you verify employers?',
            answer: 'Yes, we verify all companies and employers on our platform to ensure the legitimacy of job postings and protect our users from fraudulent listings.'
        },
        {
            question: 'How often are new jobs posted?',
            answer: 'New jobs are posted daily. We recommend checking back regularly or setting up job alerts to be notified of new opportunities matching your preferences.'
        }
    ];

    const faqCategories = [
        {
            name: 'Getting Started',
            icon: 'bx-rocket',
            count: 4
        },
        {
            name: 'Job Applications',
            icon: 'bx-briefcase',
            count: 3
        },
        {
            name: 'Account Management',
            icon: 'bx-user-circle',
            count: 3
        },
        {
            name: 'Security & Privacy',
            icon: 'bx-shield-check',
            count: 2
        }
    ];

    return (
        <AppLayout title="Frequently Asked Questions">
            <Head>
                <meta name="description" content="Find answers to frequently asked questions about Kazi Sasa, Kenya's leading job portal." />
            </Head>

            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-900 py-20 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Find answers to common questions about using Kazi Sasa to advance your career or hire top talent.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-gray-50 dark:bg-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <i className="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Categories */}
            <div className="py-12 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                            {faqCategories.map((category, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <i className={`bx ${category.icon} text-2xl text-blue-600 dark:text-blue-400`}></i>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {category.count} questions
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* FAQ Accordion */}
                        <div className="space-y-4">
                            {defaultFaqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                    >
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                            {faq.question}
                                        </h3>
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                            <i className="bx bx-chevron-down text-blue-600 dark:text-blue-400 text-xl"></i>
                                        </div>
                                    </button>
                                    {openIndex === index && (
                                        <div className="px-6 pb-5 pt-2">
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Still Have Questions Section */}
            <div className="py-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="bx bx-help-circle text-4xl text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Still have questions?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-lg"
                            >
                                <i className="bx bx-message-dots text-xl"></i>
                                Contact Support
                            </a>
                            <a
                                href="mailto:support@kazisasa.com"
                                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
                            >
                                <i className="bx bx-envelope text-xl"></i>
                                Email Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}