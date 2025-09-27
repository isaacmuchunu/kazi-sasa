import React from 'react';
import { Link } from '@inertiajs/react';

export default function CategorySection({ categories = [] }) {
    // Default categories if none provided
    const defaultCategories = [
        {
            id: 1,
            name: 'Technology',
            icon: 'bx-code-alt',
            jobs_count: 301,
            slug: 'technology',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            id: 2,
            name: 'Education',
            icon: 'bx-graduation',
            jobs_count: 210,
            slug: 'education',
            color: 'bg-green-100 text-green-600'
        },
        {
            id: 3,
            name: 'Healthcare',
            icon: 'bx-plus-medical',
            jobs_count: 281,
            slug: 'healthcare',
            color: 'bg-red-100 text-red-600'
        },
        {
            id: 4,
            name: 'Finance',
            icon: 'bx-dollar-circle',
            jobs_count: 195,
            slug: 'finance',
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            id: 5,
            name: 'Marketing',
            icon: 'bx-trending-up',
            jobs_count: 156,
            slug: 'marketing',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            id: 6,
            name: 'Engineering',
            icon: 'bx-cog',
            jobs_count: 142,
            slug: 'engineering',
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            id: 7,
            name: 'Sales',
            icon: 'bx-shopping-bag',
            jobs_count: 189,
            slug: 'sales',
            color: 'bg-orange-100 text-orange-600'
        },
        {
            id: 8,
            name: 'Design',
            icon: 'bx-palette',
            jobs_count: 98,
            slug: 'design',
            color: 'bg-pink-100 text-pink-600'
        }
    ];

    const displayCategories = categories.length > 0 ? categories : defaultCategories;

    return (
        <section className="categories-section py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="section-title text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Choose Your Category
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore thousands of job opportunities across various industries.
                        Find the perfect role that matches your skills and career goals.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayCategories.map((category, index) => (
                        <CategoryCard
                            key={category.id || index}
                            category={category}
                            delay={index * 100}
                        />
                    ))}
                </div>

                {/* View All Categories Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/categories"
                        className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <span>View All Categories</span>
                        <i className="bx bx-right-arrow-alt ml-2 text-xl"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function CategoryCard({ category, delay = 0 }) {
    return (
        <Link
            href={`/jobs?category=${category.slug}`}
            className="category-card group block"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                {/* Icon */}
                <div className="category-icon mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${category.color || 'bg-blue-100 text-blue-600'} group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`bx ${category.icon || 'bx-briefcase'} text-2xl`}></i>
                    </div>
                </div>

                {/* Content */}
                <div className="category-content">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {category.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {category.jobs_count} open position{category.jobs_count !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Hover Arrow */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <i className="bx bx-right-arrow-alt text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
            </div>
        </Link>
    );
}