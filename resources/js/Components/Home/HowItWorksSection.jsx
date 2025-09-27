import React from 'react';

export default function HowItWorksSection() {
    const steps = [
        {
            step: '01',
            title: 'Create Account',
            description: 'Sign up for free and create your professional profile with resume upload.',
            icon: 'bx-user-plus',
            color: 'text-blue-600'
        },
        {
            step: '02',
            title: 'Search Jobs',
            description: 'Browse thousands of job opportunities or use our smart search filters.',
            icon: 'bx-search',
            color: 'text-green-600'
        },
        {
            step: '03',
            title: 'Apply & Connect',
            description: 'Apply directly to jobs and connect with potential employers.',
            icon: 'bx-send',
            color: 'text-purple-600'
        },
        {
            step: '04',
            title: 'Get Hired',
            description: 'Get hired by top companies and start your dream career journey.',
            icon: 'bx-check-circle',
            color: 'text-yellow-600'
        }
    ];

    return (
        <section className="how-it-works-section py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="section-title text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Get started with Kazi Sasa in just 4 simple steps and find your dream job today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="step-card text-center group">
                            <div className="step-number mb-6">
                                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                    <span className="text-2xl font-bold text-blue-600">{step.step}</span>
                                </div>
                            </div>

                            <div className="step-icon mb-4">
                                <i className={`bx ${step.icon} text-4xl ${step.color}`}></i>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                {step.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400">
                                {step.description}
                            </p>

                            {index < steps.length - 1 && (
                                <div className="step-connector hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-600 transform translate-x-4"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}