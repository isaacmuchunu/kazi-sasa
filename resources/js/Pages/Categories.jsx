import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Categories({ categories = [] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const defaultCategories = categories.length > 0 ? categories : [
        { id: 1, name: 'Technology & IT', slug: 'technology', description: 'Software development, cybersecurity, and IT support roles', jobs_count: 450, icon: 'bx-code-alt', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
        { id: 2, name: 'Education & Training', slug: 'education', description: 'Teaching, tutoring, and educational administration', jobs_count: 320, icon: 'bx-graduation', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
        { id: 3, name: 'Healthcare & Medical', slug: 'healthcare', description: 'Medical professionals, nursing, and healthcare services', jobs_count: 280, icon: 'bx-plus-medical', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
        { id: 4, name: 'Finance & Accounting', slug: 'finance', description: 'Banking, accounting, financial analysis, and advisory', jobs_count: 230, icon: 'bx-dollar-circle', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
        { id: 5, name: 'Marketing & Sales', slug: 'marketing', description: 'Digital marketing, sales, and business development', jobs_count: 380, icon: 'bx-trending-up', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
        { id: 6, name: 'Engineering', slug: 'engineering', description: 'Civil, mechanical, electrical, and other engineering roles', jobs_count: 290, icon: 'bx-cog', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
        { id: 7, name: 'Sales & Retail', slug: 'sales', description: 'Retail management, customer service, and sales positions', jobs_count: 340, icon: 'bx-shopping-bag', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
        { id: 8, name: 'Design & Creative', slug: 'design', description: 'Graphic design, UI/UX, and creative content roles', jobs_count: 210, icon: 'bx-palette', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
        { id: 9, name: 'Administration', slug: 'administration', description: 'Office management, administrative support, and coordination', jobs_count: 270, icon: 'bx-buildings', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
        { id: 10, name: 'Customer Service', slug: 'customer-service', description: 'Customer support, call center, and client relations', jobs_count: 310, icon: 'bx-support', color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
        { id: 11, name: 'Human Resources', slug: 'human-resources', description: 'HR management, recruitment, and people operations', jobs_count: 180, icon: 'bx-group', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' },
        { id: 12, name: 'Legal & Compliance', slug: 'legal', description: 'Legal counsel, compliance, and regulatory affairs', jobs_count: 150, icon: 'bx-briefcase-alt', color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' }
    ];

    const filteredCategories = defaultCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCategoryClick = (slug) => {
        router.get(`/jobs?category=${slug}`);
    };

    const topCategories = [...defaultCategories]
        .sort((a, b) => b.jobs_count - a.jobs_count)
        .slice(0, 6);

    return (
        <AppLayout title="Job Categories">
            <Head>
                <meta name="description" content="Explore job categories across various industries. Find opportunities in technology, healthcare, finance, education, and more." />
            </Head>

            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-900 py-20 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Explore Job Categories
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Discover opportunities across various industries and find the perfect role for your skills.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <i className="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Categories */}
            <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Most Popular Categories
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Start your search with our top categories
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {topCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.slug)}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl group text-left"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <i className={`bx ${category.icon} text-3xl`}></i>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {category.jobs_count}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            jobs
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {category.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* All Categories Grid */}
            <div className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            All Categories
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {filteredCategories.length} categories available
                        </p>
                    </div>

                    {filteredCategories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {filteredCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.slug)}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 group text-left"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                            <i className={`bx ${category.icon} text-2xl`}></i>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                {category.jobs_count} open positions
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <i className="bx bx-search text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                            <p className="text-xl text-gray-500 dark:text-gray-400">
                                No categories found matching your search.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
                        {[
                            { number: '12+', label: 'Job Categories', icon: 'bx-category' },
                            { number: '3,500+', label: 'Active Jobs', icon: 'bx-briefcase' },
                            { number: '2,000+', label: 'Companies Hiring', icon: 'bx-buildings' },
                            { number: '10,000+', label: 'Candidates', icon: 'bx-group' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                                <i className={`bx ${stat.icon} text-4xl text-blue-600 dark:text-blue-400 mb-3`}></i>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Can't Find Your Category?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Browse all available jobs or contact us to discuss adding new categories.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/jobs"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-lg"
                            >
                                Browse All Jobs
                                <i className="bx bx-right-arrow-alt text-xl"></i>
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}