import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CompaniesIndex({
    companies = [],
    filters = {},
    pagination = {},
    stats = {}
}) {
    const [searchFilters, setSearchFilters] = useState({
        search: filters.search || '',
        location: filters.location || '',
        industry: filters.industry || '',
        size: filters.size || '',
        sort: filters.sort || 'name'
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

        router.get('/companies', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setSearchFilters({
            search: '',
            location: '',
            industry: '',
            size: '',
            sort: 'name'
        });
        router.get('/companies');
    };

    return (
        <AppLayout title="Browse Companies">
            <Head>
                <meta name="description" content="Discover top companies hiring in Kenya. Browse company profiles, view open positions, and find your ideal employer." />
            </Head>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-bold mb-4">Browse Companies</h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Discover {stats.total || '100+'} companies hiring across Kenya
                        </p>

                        {/* Quick Search */}
                        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    placeholder="Company name or industry"
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
                                <button
                                    onClick={() => router.get('/companies', searchFilters)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    <i className="bx bx-search mr-2"></i>
                                    Search Companies
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

                            {/* Industry Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Industry</h4>
                                <div className="space-y-2">
                                    {['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'].map(industry => (
                                        <label key={industry} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="industry"
                                                value={industry}
                                                checked={searchFilters.industry === industry}
                                                onChange={(e) => handleFilterChange('industry', e.target.value)}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{industry}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Company Size Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Company Size</h4>
                                <div className="space-y-2">
                                    {[
                                        { label: '1-10 employees', value: '1-10' },
                                        { label: '11-50 employees', value: '11-50' },
                                        { label: '51-200 employees', value: '51-200' },
                                        { label: '201-500 employees', value: '201-500' },
                                        { label: '500+ employees', value: '500+' }
                                    ].map(size => (
                                        <label key={size.value} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="size"
                                                value={size.value}
                                                checked={searchFilters.size === size.value}
                                                onChange={(e) => handleFilterChange('size', e.target.value)}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{size.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {pagination.total || 0} Companies Found
                                </h2>
                                {filters.search && (
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Results for "{filters.search}"
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                {/* Sort */}
                                <select
                                    value={searchFilters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="name">Company Name</option>
                                    <option value="jobs_count">Most Jobs</option>
                                    <option value="newest">Newest First</option>
                                </select>

                                {/* View Toggle */}
                                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        <i className="bx bx-grid-alt"></i>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        <i className="bx bx-list-ul"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Companies Grid/List */}
                        {companies.length > 0 ? (
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                : 'space-y-4'
                            }>
                                {companies.map(company => (
                                    <CompanyCard key={company.id} company={company} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <i className="bx bx-building text-6xl text-gray-400 mb-4"></i>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No companies found</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your search criteria or filters</p>
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
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            Previous
                                        </Link>
                                    )}

                                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Link
                                                key={page}
                                                href={`/companies?page=${page}`}
                                                className={`px-3 py-2 border rounded-lg ${
                                                    pagination.current_page === page
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        );
                                    })}

                                    {pagination.next_page_url && (
                                        <Link
                                            href={pagination.next_page_url}
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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

function CompanyCard({ company, viewMode }) {
    if (viewMode === 'list') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-grow">
                        <img
                            src={company.logo || '/assets/img/company-placeholder.png'}
                            alt={company.name}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600">
                                        <Link href={`/companies/${company.slug}`}>{company.name}</Link>
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{company.industry}</p>
                                </div>
                                {company.is_verified && (
                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                        <i className="bx bx-check-circle"></i>
                                        Verified
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <span className="flex items-center gap-1">
                                    <i className="bx bx-map-pin"></i>
                                    {company.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <i className="bx bx-briefcase"></i>
                                    {company.jobs_count || 0} {company.jobs_count === 1 ? 'Job' : 'Jobs'}
                                </span>
                                {company.size && (
                                    <span className="flex items-center gap-1">
                                        <i className="bx bx-group"></i>
                                        {company.size} employees
                                    </span>
                                )}
                            </div>

                            {company.description && (
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-1">
                                    {company.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="ml-4">
                        <Link
                            href={`/companies/${company.slug}`}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            View Company
                            <i className="bx bx-chevron-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <Link href={`/companies/${company.slug}`} className="block">
                <div className="p-6">
                    {/* Company Logo */}
                    <div className="flex items-center justify-center mb-4">
                        <img
                            src={company.logo || '/assets/img/company-placeholder.png'}
                            alt={company.name}
                            className="w-20 h-20 rounded-lg object-cover"
                        />
                    </div>

                    {/* Company Name & Verification */}
                    <div className="text-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 mb-1">
                            {company.name}
                        </h3>
                        {company.is_verified && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                <i className="bx bx-check-circle"></i>
                                Verified
                            </span>
                        )}
                    </div>

                    {/* Industry */}
                    {company.industry && (
                        <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-4">
                            {company.industry}
                        </p>
                    )}

                    {/* Company Info */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                            <i className="bx bx-map-pin mr-2 text-blue-500"></i>
                            <span>{company.location}</span>
                        </div>
                        <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                            <i className="bx bx-briefcase mr-2 text-green-500"></i>
                            <span>{company.jobs_count || 0} Open {company.jobs_count === 1 ? 'Position' : 'Positions'}</span>
                        </div>
                        {company.size && (
                            <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                                <i className="bx bx-group mr-2 text-purple-500"></i>
                                <span>{company.size} employees</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {company.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm text-center line-clamp-2 mb-4">
                            {company.description}
                        </p>
                    )}

                    {/* View Button */}
                    <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                            View Company
                            <i className="bx bx-chevron-right"></i>
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}