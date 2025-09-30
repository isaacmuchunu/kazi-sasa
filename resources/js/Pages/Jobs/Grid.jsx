import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistanceToNow } from 'date-fns';

export default function Grid({
    jobs = [],
    categories = [],
    filters = {},
    pagination = {},
    stats = {}
}) {
    const [searchFilters, setSearchFilters] = useState({
        search: filters.search || '',
        location: filters.location || '',
        category: filters.category || '',
        job_type: filters.job_type || '',
        salary_min: filters.salary_min || '',
        experience_level: filters.experience_level || '',
        sort: filters.sort || 'latest'
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...searchFilters, [key]: value };
        setSearchFilters(newFilters);

        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.append(k, v);
        });

        router.get('/jobs', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setSearchFilters({
            search: '',
            location: '',
            category: '',
            job_type: '',
            salary_min: '',
            experience_level: '',
            sort: 'latest'
        });
        router.get('/jobs');
    };

    return (
        <AppLayout>
            <Head title="Browse Jobs - Grid View" />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-4">Explore Opportunities</h1>
                        <p className="text-xl text-blue-100 mb-8">
                            {stats.total || '0'} jobs waiting for you
                        </p>

                        {/* Quick Search */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <input
                                    type="text"
                                    placeholder="Job title or keyword"
                                    value={searchFilters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={searchFilters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
                                />
                                <select
                                    value={searchFilters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => router.get('/jobs', searchFilters)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    <i className="bx bx-search mr-2"></i>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <div className="lg:w-1/4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                                    <button
                                        onClick={clearFilters}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Job Type Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Job Type</h4>
                                    <div className="space-y-2">
                                        {['full_time', 'part_time', 'contract', 'freelance', 'internship'].map(type => (
                                            <label key={type} className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="job_type"
                                                    value={type}
                                                    checked={searchFilters.job_type === type}
                                                    onChange={(e) => handleFilterChange('job_type', e.target.value)}
                                                    className="text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                    {type.replace('_', ' ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Experience Level Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Experience Level</h4>
                                    <div className="space-y-2">
                                        {['entry_level', 'mid_level', 'senior_level', 'executive'].map(level => (
                                            <label key={level} className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="experience_level"
                                                    value={level}
                                                    checked={searchFilters.experience_level === level}
                                                    onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                                                    className="text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                    {level.replace('_', ' ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Salary Range Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Minimum Salary</h4>
                                    <select
                                        value={searchFilters.salary_min}
                                        onChange={(e) => handleFilterChange('salary_min', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Any Salary</option>
                                        <option value="50000">KSh 50,000+</option>
                                        <option value="100000">KSh 100,000+</option>
                                        <option value="150000">KSh 150,000+</option>
                                        <option value="200000">KSh 200,000+</option>
                                        <option value="300000">KSh 300,000+</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Jobs Grid */}
                        <div className="lg:w-3/4">
                            {/* Results Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {pagination.total || 0} Jobs Found
                                    </h2>
                                    {filters.search && (
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Results for "{filters.search}"
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                    <select
                                        value={searchFilters.sort}
                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="latest">Latest Jobs</option>
                                        <option value="salary_high">Highest Salary</option>
                                        <option value="salary_low">Lowest Salary</option>
                                        <option value="company">Company Name</option>
                                    </select>

                                    <Link
                                        href="/jobs/list"
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white"
                                    >
                                        <i className="bx bx-list-ul"></i>
                                    </Link>
                                </div>
                            </div>

                            {/* Jobs Grid */}
                            {jobs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {jobs.map(job => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                                    <i className="bx bx-search-alt text-6xl text-gray-400 mb-4"></i>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Try adjusting your search criteria or filters
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination.last_page > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex items-center gap-2">
                                        {pagination.prev_page_url && (
                                            <Link
                                                href={pagination.prev_page_url}
                                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                Previous
                                            </Link>
                                        )}

                                        {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                            const page = i + 1;
                                            return (
                                                <Link
                                                    key={page}
                                                    href={`/jobs?page=${page}`}
                                                    className={`px-3 py-2 border rounded-lg ${
                                                        pagination.current_page === page
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {page}
                                                </Link>
                                            );
                                        })}

                                        {pagination.next_page_url && (
                                            <Link
                                                href={pagination.next_page_url}
                                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

function JobCard({ job }) {
    const [isSaved, setIsSaved] = useState(job.is_saved || false);

    const handleSaveJob = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const response = await fetch(`/jobs/${job.id}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                }
            });

            if (response.ok) {
                setIsSaved(!isSaved);
            }
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };

    const formatSalary = (min, max, period) => {
        if (!min && !max) return 'Salary not disclosed';

        const formatAmount = (amount) => {
            if (amount >= 1000000) {
                return `$${(amount / 1000000).toFixed(1)}M`;
            } else if (amount >= 1000) {
                return `$${(amount / 1000).toFixed(0)}K`;
            }
            return `$${amount}`;
        };

        if (min && max) {
            return `${formatAmount(min)} - ${formatAmount(max)} / ${period}`;
        } else if (min) {
            return `${formatAmount(min)}+ / ${period}`;
        }
        return `Up to ${formatAmount(max)} / ${period}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={job.company?.logo || '/assets/img/company-logo/default.png'}
                        alt={job.company?.name}
                        className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.company?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            {job.created_at && formatDistanceToNow(new Date(job.created_at))} ago
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSaveJob}
                    className={`p-2 rounded-lg transition-colors ${
                        isSaved
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                >
                    <i className={`bx ${isSaved ? 'bxs-heart' : 'bx-heart'} text-xl`}></i>
                </button>
            </div>

            <Link href={`/jobs/${job.slug}`}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400">
                    {job.title}
                </h3>
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.is_featured && (
                    <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                    </span>
                )}
                {job.is_urgent && (
                    <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                        Urgent
                    </span>
                )}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <i className="bx bx-map text-blue-500 mr-2"></i>
                    <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <i className="bx bx-time text-green-500 mr-2"></i>
                    <span className="text-sm capitalize">{job.job_type?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <i className="bx bx-dollar text-yellow-500 mr-2"></i>
                    <span className="text-sm font-medium">
                        {formatSalary(job.salary_min, job.salary_max, job.salary_period)}
                    </span>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <Link
                    href={`/jobs/${job.slug}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center block"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}