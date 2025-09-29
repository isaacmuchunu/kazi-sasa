import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function PrivacyPolicy() {
    const sections = [
        {
            title: 'Information We Collect',
            icon: 'bx-info-circle',
            content: [
                {
                    subtitle: 'Personal Information',
                    text: 'When you register for an account, we collect information such as your name, email address, phone number, and professional details including work experience, education, and skills.'
                },
                {
                    subtitle: 'Automatically Collected Information',
                    text: 'We automatically collect certain information about your device, including IP address, browser type, operating system, and usage patterns when you interact with our platform.'
                },
                {
                    subtitle: 'Cookies and Tracking Technologies',
                    text: 'We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings.'
                }
            ]
        },
        {
            title: 'How We Use Your Information',
            icon: 'bx-use',
            content: [
                {
                    subtitle: 'Service Delivery',
                    text: 'We use your information to provide, maintain, and improve our job portal services, including job matching, application tracking, and communication between employers and candidates.'
                },
                {
                    subtitle: 'Personalization',
                    text: 'Your data helps us personalize your experience by recommending relevant job opportunities, displaying targeted content, and customizing your dashboard.'
                },
                {
                    subtitle: 'Communication',
                    text: 'We use your contact information to send you important updates, job alerts, promotional materials, and respond to your inquiries. You can opt-out of marketing communications at any time.'
                },
                {
                    subtitle: 'Analytics and Improvement',
                    text: 'We analyze usage patterns and user behavior to improve our platform, develop new features, and enhance user experience.'
                }
            ]
        },
        {
            title: 'Information Sharing and Disclosure',
            icon: 'bx-share-alt',
            content: [
                {
                    subtitle: 'Employers',
                    text: 'When you apply for a job, we share your profile information and application materials with the respective employer. You control what information is visible in your profile.'
                },
                {
                    subtitle: 'Service Providers',
                    text: 'We may share your information with trusted third-party service providers who assist us in operating our platform, such as hosting services, analytics providers, and payment processors.'
                },
                {
                    subtitle: 'Legal Requirements',
                    text: 'We may disclose your information when required by law, to protect our rights, prevent fraud, or ensure the safety of our users.'
                },
                {
                    subtitle: 'Business Transfers',
                    text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.'
                }
            ]
        },
        {
            title: 'Data Security',
            icon: 'bx-shield-check',
            content: [
                {
                    subtitle: 'Security Measures',
                    text: 'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.'
                },
                {
                    subtitle: 'Data Retention',
                    text: 'We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your account at any time.'
                },
                {
                    subtitle: 'Account Security',
                    text: 'You are responsible for maintaining the confidentiality of your account credentials. Please notify us immediately if you suspect unauthorized access to your account.'
                }
            ]
        },
        {
            title: 'Your Rights and Choices',
            icon: 'bx-user-check',
            content: [
                {
                    subtitle: 'Access and Correction',
                    text: 'You have the right to access, update, and correct your personal information at any time through your account settings.'
                },
                {
                    subtitle: 'Data Portability',
                    text: 'You can request a copy of your personal data in a structured, machine-readable format.'
                },
                {
                    subtitle: 'Deletion',
                    text: 'You have the right to request deletion of your account and personal information, subject to certain legal retention requirements.'
                },
                {
                    subtitle: 'Marketing Preferences',
                    text: 'You can opt-out of marketing communications by clicking the unsubscribe link in our emails or adjusting your notification settings.'
                }
            ]
        },
        {
            title: 'Children\'s Privacy',
            icon: 'bx-child',
            content: [
                {
                    subtitle: 'Age Requirement',
                    text: 'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it promptly.'
                }
            ]
        },
        {
            title: 'Changes to This Policy',
            icon: 'bx-revision',
            content: [
                {
                    subtitle: 'Policy Updates',
                    text: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting a notice on our platform or sending you an email.'
                },
                {
                    subtitle: 'Effective Date',
                    text: 'This Privacy Policy was last updated on January 1, 2024. Your continued use of our services after any changes indicates your acceptance of the updated policy.'
                }
            ]
        }
    ];

    return (
        <AppLayout title="Privacy Policy">
            <Head>
                <meta name="description" content="Read the Kazi Sasa Privacy Policy to understand how we collect, use, and protect your personal information." />
            </Head>

            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-900 py-20 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="bx bx-shield-check text-4xl text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last updated: January 1, 2024
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Navigation */}
            <div className="py-8 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {sections.map((section, index) => (
                            <a
                                key={index}
                                href={`#section-${index}`}
                                className="text-sm px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
                            >
                                {section.title}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-16">
                        {sections.map((section, index) => (
                            <div key={index} id={`section-${index}`} className="scroll-mt-32">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <i className={`bx ${section.icon} text-2xl text-blue-600 dark:text-blue-400`}></i>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {section.title}
                                        </h2>
                                    </div>
                                </div>

                                <div className="space-y-6 ml-16">
                                    {section.content.map((item, itemIndex) => (
                                        <div key={itemIndex} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                                {item.subtitle}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="py-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="bx bx-envelope text-4xl text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Questions About Our Privacy Policy?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            If you have any questions or concerns about how we handle your data, please don't hesitate to contact us.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-lg"
                            >
                                <i className="bx bx-message-dots text-xl"></i>
                                Contact Us
                            </a>
                            <a
                                href="mailto:privacy@kazisasa.com"
                                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
                            >
                                <i className="bx bx-envelope text-xl"></i>
                                Email Privacy Team
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}