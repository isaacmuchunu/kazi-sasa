import React from 'react';
import { Link } from '@inertiajs/react';

export default function CompanySection({ companies = [] }) {
    const defaultCompanies = [
        { id: 1, name: 'Safaricom', logo: '/assets/img/company-logo/1.png', jobs_count: 45 },
        { id: 2, name: 'KCB Bank', logo: '/assets/img/company-logo/2.png', jobs_count: 23 },
        { id: 3, name: 'Equity Bank', logo: '/assets/img/company-logo/3.png', jobs_count: 34 },
        { id: 4, name: 'EABL', logo: '/assets/img/company-logo/4.png', jobs_count: 18 },
        { id: 5, name: 'Kenya Airways', logo: '/assets/img/company-logo/5.png', jobs_count: 12 },
        { id: 6, name: 'Bamburi Cement', logo: '/assets/img/company-logo/6.png', jobs_count: 8 }
    ];

    const displayCompanies = companies.length > 0 ? companies : defaultCompanies;

    return (
        <section className="company-section py-16 lg:py-24 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="section-title text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Top Companies
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Join thousands of professionals who have found their dream jobs with leading companies in Kenya.
                    </p>
                </div>

                <div className="companies-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
                    {displayCompanies.map((company, index) => (
                        <Link
                            key={company.id}
                            href={`/companies/${company.slug || company.id}`}
                            className="company-card group"
                        >
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                                <div className="company-logo mb-4">
                                    <img
                                        src={company.logo || '/assets/img/company-logo/default.png'}
                                        alt={company.name}
                                        className="w-full h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = '/assets/img/company-logo/default.png';
                                        }}
                                    />
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white text-center mb-2">
                                    {company.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    {company.jobs_count} Jobs
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/companies"
                        className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        View All Companies
                        <i className="bx bx-right-arrow-alt ml-2 text-xl"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}