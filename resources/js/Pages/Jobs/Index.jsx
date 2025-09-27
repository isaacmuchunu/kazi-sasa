import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function JobsIndex({
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

    const [viewMode, setViewMode] = useState('grid');

    const handleFilterChange = (key, value) => {
        const newFilters = { ...searchFilters, [key]: value };
        setSearchFilters(newFilters);

        // Update URL with new filters
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
        <AppLayout title="Find Jobs">
            <Head>
                <meta name="description" content="Browse thousands of job opportunities in Kenya across all industries and experience levels." />
            </Head>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Discover {stats.total || '1000+'} job opportunities across Kenya
                        </p>

                        {/* Quick Search */}
                        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder="Job title, keywords, or company"
                                    value={searchFilters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={searchFilters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                                <select
                                    value={searchFilters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                                    Search Jobs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Results */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Job Type Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
                                <div className="space-y-2">
                                    {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map(type => (
                                        <label key={type} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="job_type"
                                                value={type}
                                                checked={searchFilters.job_type === type}
                                                onChange={(e) => handleFilterChange('job_type', e.target.value)}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Level Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Experience Level</h4>
                                <div className="space-y-2">
                                    {['Entry level', 'Mid level', 'Senior level', 'Executive'].map(level => (
                                        <label key={level} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="experience_level"
                                                value={level}
                                                checked={searchFilters.experience_level === level}
                                                onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Salary Range Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Minimum Salary</h4>
                                <select
                                    value={searchFilters.salary_min}
                                    onChange={(e) => handleFilterChange('salary_min', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {pagination.total || 0} Jobs Found
                                </h2>
                                {filters.search && (
                                    <p className="text-gray-600">
                                        Results for "{filters.search}"
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                {/* Sort */}
                                <select
                                    value={searchFilters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="latest">Latest Jobs</option>
                                    <option value="salary_high">Highest Salary</option>
                                    <option value="salary_low">Lowest Salary</option>
                                    <option value="company">Company Name</option>
                                </select>

                                {/* View Toggle */}
                                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <i className="bx bx-grid-alt"></i>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <i className="bx bx-list-ul"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Jobs Grid/List */}
                        {jobs.length > 0 ? (
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                                : 'space-y-4'
                            }>
                                {jobs.map(job => (
                                    <JobCard key={job.id} job={job} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <i className="bx bx-search-alt text-6xl text-gray-400 mb-4"></i>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                                <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
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
                                <nav className="flex items-center space-x-2">
                                    {pagination.prev_page_url && (
                                        <Link
                                            href={pagination.prev_page_url}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        );
                                    })}

                                    {pagination.next_page_url && (
                                        <Link
                                            href={pagination.next_page_url}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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
        </AppLayout>
    );
}

function JobCard({ job, viewMode }) {
    const [isSaved, setIsSaved] = useState(false);

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

    if (viewMode === 'list') {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-grow">
                        <img
                            src={job.company?.logo || '/assets/img/company-logo/default.png'}
                            alt={job.company?.name}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-grow">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                                        <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
                                    </h3>
                                    <p className="text-gray-600">{job.company?.name}</p>
                                </div>
                                <div className="flex gap-2">
                                    {job.is_featured && (
                                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                                            Featured
                                        </span>
                                    )}
                                    {job.is_urgent && (
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                                            Urgent
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                <span className="flex items-center">
                                    <i className="bx bx-map mr-1"></i>
                                    {job.location}
                                </span>
                                <span className="flex items-center">
                                    <i className="bx bx-time mr-1"></i>
                                    {job.job_type}
                                </span>
                                <span className="flex items-center">
                                    <i className="bx bx-dollar mr-1"></i>
                                    {job.salary_range}
                                </span>
                                <span className="flex items-center">
                                    <i className="bx bx-calendar mr-1"></i>
                                    {job.posted_ago}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        <button
                            onClick={handleSaveJob}
                            className={`p-2 rounded-lg transition-colors ${
                                isSaved
                                    ? 'text-red-500 bg-red-50'
                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }`}
                        >
                            <i className={`bx ${isSaved ? 'bxs-heart' : 'bx-heart'} text-xl`}></i>
                        </button>
                        <Link
                            href={`/jobs/${job.slug}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Apply Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={job.company?.logo || '/assets/img/company-logo/default.png'}
                        alt={job.company?.name}
                        className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                        <p className="text-sm text-gray-600">{job.company?.name}</p>
                        <p className="text-xs text-gray-500">{job.posted_ago}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {job.is_featured && (
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                        </span>
                    )}
                    {job.is_urgent && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                            Urgent
                        </span>
                    )}
                </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600">
                <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
            </h3>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                    <i className="bx bx-map mr-2 text-blue-500"></i>
                    <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <i className="bx bx-time mr-2 text-green-500"></i>
                    <span className="text-sm">{job.job_type}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <i className="bx bx-dollar mr-2 text-yellow-500"></i>
                    <span className="text-sm font-medium">{job.salary_range}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                    onClick={handleSaveJob}
                    className={`p-2 rounded-lg transition-colors ${
                        isSaved
                            ? 'text-red-500 bg-red-50'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                >
                    <i className={`bx ${isSaved ? 'bxs-heart' : 'bx-heart'} text-xl`}></i>
                </button>
                <Link
                    href={`/jobs/${job.slug}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Apply Now
                </Link>
            </div>
        </div>
    );
}