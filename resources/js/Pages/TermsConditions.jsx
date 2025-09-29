import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function TermsConditions() {
    const sections = [
        {
            title: 'Acceptance of Terms',
            icon: 'bx-check-circle',
            content: [
                {
                    subtitle: 'Agreement to Terms',
                    text: 'By accessing and using Kazi Sasa, you agree to be bound by these Terms and Conditions, our Privacy Policy, and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.'
                },
                {
                    subtitle: 'Eligibility',
                    text: 'You must be at least 18 years old and legally capable of entering into binding contracts to use our services. By using Kazi Sasa, you represent and warrant that you meet these requirements.'
                }
            ]
        },
        {
            title: 'User Accounts',
            icon: 'bx-user-circle',
            content: [
                {
                    subtitle: 'Account Creation',
                    text: 'To access certain features of our platform, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.'
                },
                {
                    subtitle: 'Account Security',
                    text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.'
                },
                {
                    subtitle: 'Account Termination',
                    text: 'We reserve the right to suspend or terminate your account at any time, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties, or for any other reason in our sole discretion.'
                }
            ]
        },
        {
            title: 'User Conduct and Responsibilities',
            icon: 'bx-user-check',
            content: [
                {
                    subtitle: 'Acceptable Use',
                    text: 'You agree to use Kazi Sasa only for lawful purposes and in accordance with these Terms. You must not use our platform to transmit any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.'
                },
                {
                    subtitle: 'Job Seekers',
                    text: 'As a job seeker, you agree to provide truthful and accurate information in your profile and job applications. You must not misrepresent your qualifications, experience, or any other information. You are responsible for ensuring your resume and application materials do not infringe on any third-party rights.'
                },
                {
                    subtitle: 'Employers',
                    text: 'As an employer, you agree to post only legitimate job opportunities and to comply with all applicable employment laws and regulations. You must not discriminate against candidates based on protected characteristics. You are responsible for the accuracy and legality of all job postings.'
                },
                {
                    subtitle: 'Prohibited Activities',
                    text: 'You must not: (a) use automated systems to access the platform without permission; (b) attempt to gain unauthorized access to any portion of the platform; (c) interfere with or disrupt the platform or servers; (d) collect or harvest personal information about users; (e) use the platform for any fraudulent or illegal purpose.'
                }
            ]
        },
        {
            title: 'Content and Intellectual Property',
            icon: 'bx-copyright',
            content: [
                {
                    subtitle: 'Platform Content',
                    text: 'All content on Kazi Sasa, including text, graphics, logos, images, software, and other materials, is owned by or licensed to us and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.'
                },
                {
                    subtitle: 'User-Generated Content',
                    text: 'By posting content on Kazi Sasa (including job postings, profiles, resumes, and applications), you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, and display such content for the purposes of operating and promoting our platform.'
                },
                {
                    subtitle: 'Content Responsibility',
                    text: 'You are solely responsible for the content you post on our platform. We do not endorse, support, represent, or guarantee the truthfulness, accuracy, or reliability of any user-generated content.'
                },
                {
                    subtitle: 'Content Removal',
                    text: 'We reserve the right to remove any content that violates these Terms, is otherwise objectionable, or for any other reason at our sole discretion, without notice.'
                }
            ]
        },
        {
            title: 'Job Postings and Applications',
            icon: 'bx-briefcase',
            content: [
                {
                    subtitle: 'Job Posting Guidelines',
                    text: 'Employers must ensure their job postings are accurate, complete, and comply with all applicable laws. Job postings must not contain misleading information, discriminatory requirements, or requests for illegal activities. We reserve the right to reject or remove any job posting that does not meet our standards.'
                },
                {
                    subtitle: 'Application Process',
                    text: 'When you apply for a job through Kazi Sasa, we facilitate the transmission of your application materials to the employer. We are not responsible for the employer\'s use of your information or their hiring decisions. The relationship between job seekers and employers is solely between those parties.'
                },
                {
                    subtitle: 'No Employment Relationship',
                    text: 'Kazi Sasa is a platform that connects job seekers with employers. We are not an employer, and we do not make hiring decisions. We are not responsible for the actions or omissions of employers or job seekers using our platform.'
                }
            ]
        },
        {
            title: 'Payments and Subscriptions',
            icon: 'bx-dollar-circle',
            content: [
                {
                    subtitle: 'Pricing',
                    text: 'Certain features of Kazi Sasa require payment of fees. All fees are stated in US Dollars (USD) or Kenyan Shillings (KES) and are non-refundable unless otherwise specified. We reserve the right to change our pricing at any time with notice to users.'
                },
                {
                    subtitle: 'Subscription Services',
                    text: 'If you purchase a subscription, you authorize us to charge your payment method on a recurring basis according to your subscription plan. Subscriptions automatically renew unless cancelled before the renewal date.'
                },
                {
                    subtitle: 'Cancellation',
                    text: 'You may cancel your subscription at any time through your account settings. Upon cancellation, you will retain access to paid features until the end of your current billing period. No refunds will be provided for partial billing periods.'
                },
                {
                    subtitle: 'Payment Processing',
                    text: 'Payments are processed by third-party payment processors. You agree to be bound by their terms and conditions. We are not responsible for any errors or issues arising from payment processing.'
                }
            ]
        },
        {
            title: 'Disclaimers and Limitations of Liability',
            icon: 'bx-shield-x',
            content: [
                {
                    subtitle: 'Service Availability',
                    text: 'Kazi Sasa is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that our platform will be uninterrupted, error-free, or secure. We may modify, suspend, or discontinue any aspect of our platform at any time without notice.'
                },
                {
                    subtitle: 'Third-Party Content',
                    text: 'We are not responsible for the accuracy, legality, or content of job postings, user profiles, or other content posted by users. We do not verify the credentials, qualifications, or background of employers or job seekers. You interact with other users at your own risk.'
                },
                {
                    subtitle: 'Limitation of Liability',
                    text: 'To the maximum extent permitted by law, Kazi Sasa and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our platform.'
                },
                {
                    subtitle: 'Maximum Liability',
                    text: 'Our total liability to you for any claims arising from your use of Kazi Sasa shall not exceed the amount you paid us in the twelve months preceding the claim, or $100 USD, whichever is greater.'
                }
            ]
        },
        {
            title: 'Indemnification',
            icon: 'bx-shield-alt-2',
            content: [
                {
                    subtitle: 'Your Indemnification Obligations',
                    text: 'You agree to indemnify, defend, and hold harmless Kazi Sasa, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from: (a) your use of our platform; (b) your violation of these Terms; (c) your violation of any rights of another party; or (d) any content you post on our platform.'
                }
            ]
        },
        {
            title: 'Changes to Terms',
            icon: 'bx-revision',
            content: [
                {
                    subtitle: 'Modifications',
                    text: 'We reserve the right to modify these Terms and Conditions at any time. We will notify you of significant changes by posting a notice on our platform or sending you an email. Your continued use of Kazi Sasa after such modifications constitutes your acceptance of the updated Terms.'
                },
                {
                    subtitle: 'Effective Date',
                    text: 'These Terms and Conditions were last updated on January 1, 2024. The updated terms become effective immediately upon posting unless otherwise specified.'
                }
            ]
        },
        {
            title: 'General Provisions',
            icon: 'bx-file',
            content: [
                {
                    subtitle: 'Governing Law',
                    text: 'These Terms and Conditions are governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts located in Nairobi, Kenya.'
                },
                {
                    subtitle: 'Severability',
                    text: 'If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.'
                },
                {
                    subtitle: 'Entire Agreement',
                    text: 'These Terms and Conditions, together with our Privacy Policy, constitute the entire agreement between you and Kazi Sasa regarding your use of our platform and supersede all prior agreements and understandings.'
                },
                {
                    subtitle: 'Waiver',
                    text: 'Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.'
                }
            ]
        }
    ];

    return (
        <AppLayout title="Terms and Conditions">
            <Head>
                <meta name="description" content="Read the Kazi Sasa Terms and Conditions to understand the rules and guidelines for using our job portal platform." />
            </Head>

            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-900 py-20 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="bx bx-file-blank text-4xl text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Terms and Conditions
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                            Please read these terms carefully before using Kazi Sasa. By using our platform, you agree to be bound by these terms.
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
                            <i className="bx bx-help-circle text-4xl text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Questions About These Terms?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            If you have any questions or concerns about our Terms and Conditions, please contact our legal team.
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
                                href="mailto:legal@kazisasa.com"
                                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
                            >
                                <i className="bx bx-envelope text-xl"></i>
                                Email Legal Team
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}