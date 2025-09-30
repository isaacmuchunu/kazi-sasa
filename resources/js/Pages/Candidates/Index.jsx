import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CandidatesIndex({
    candidates = [],
    filters = {},
    pagination = {},
    stats = {}
}) {
    const [searchFilters, setSearchFilters] = useState({
        search: filters.search || '',
        location: filters.location || '',
        skills: filters.skills || '',
        experience_level: filters.experience_level || '',
        available_for_hire: filters.available_for_hire || '',
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

        router.get('/candidates', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setSearchFilters({
            search: '',
            location: '',
            skills: '',
            experience_level: '',
            available_for_hire: '',
            sort: 'latest'
        });
        router.get('/candidates');
    };

    return (
        <AppLayout title="Find Candidates">
            <Head>
                <meta name="description" content="Browse talented candidates in Kenya looking for job opportunities across all industries and experience levels." />
            </Head>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-bold mb-4">Find Talented Candidates</h1>
                        <p className="text-xl text-purple-100 mb-8">
                            Discover {stats.total || '500+'} qualified candidates across Kenya
                        </p>

                        {/* Quick Search */}
                        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder="Name, title, or keywords"
                                    value={searchFilters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={searchFilters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                />
                                <input
                                    type="text"
                                    placeholder="Skills (e.g., React, PHP)"
                                    value={searchFilters.skills}
                                    onChange={(e) => handleFilterChange('skills', e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                />
                                <button
                                    onClick={() => router.get('/candidates', searchFilters)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    <i className="bx bx-search mr-2"></i>
                                    Search Candidates
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
                                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Availability Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Availability</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={searchFilters.available_for_hire === 'true'}
                                            onChange={(e) => handleFilterChange('available_for_hire', e.target.checked ? 'true' : '')}
                                            className="text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Available for Hire</span>
                                    </label>
                                </div>
                            </div>

                            {/* Experience Level Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Experience Level</h4>
                                <div className="space-y-2">
                                    {['Entry level', 'Mid level', 'Senior level', 'Executive'].map(level => (
                                        <label key={level} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="experience_level"
                                                value={level}
                                                checked={searchFilters.experience_level === level}
                                                onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                                                className="text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{level}</span>
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
                                    {pagination.total || 0} Candidates Found
                                </h2>
                                {filters.search && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Results for "{filters.search}"
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                {/* Sort */}
                                <select
                                    value={searchFilters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="latest">Latest Profiles</option>
                                    <option value="experience">Most Experienced</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>

                                {/* View Toggle */}
                                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                    >
                                        <i className="bx bx-grid-alt"></i>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 py-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                    >
                                        <i className="bx bx-list-ul"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Candidates Grid/List */}
                        {candidates.length > 0 ? (
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                                : 'space-y-4'
                            }>
                                {candidates.map(candidate => (
                                    <CandidateCard key={candidate.id} candidate={candidate} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <i className="bx bx-user-search text-6xl text-gray-400 mb-4"></i>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No candidates found</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search criteria or filters</p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
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
                                                href={`/candidates?page=${page}`}
                                                className={`px-3 py-2 border rounded-lg ${
                                                    pagination.current_page === page
                                                        ? 'bg-purple-600 text-white border-purple-600'
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

function CandidateCard({ candidate, viewMode }) {
    const profile = candidate.candidate_profile || {};
    const skills = profile.skills || [];
    const experience = profile.experience || [];

    // Calculate total years of experience
    const totalYears = experience.reduce((total, exp) => {
        const years = parseInt(exp.years) || 0;
        return total + years;
    }, 0);

    if (viewMode === 'list') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-grow">
                        <img
                            src={candidate.profile_image || '/assets/img/avatar-placeholder.png'}
                            alt={`${candidate.first_name} ${candidate.last_name}`}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-grow">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-purple-600">
                                        <Link href={`/candidates/${candidate.id}`}>
                                            {candidate.first_name} {candidate.last_name}
                                        </Link>
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{candidate.job_title || 'Professional'}</p>
                                </div>
                                <div className="flex gap-2">
                                    {profile.available_for_hire && (
                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                                            Available
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {candidate.location && (
                                    <span className="flex items-center">
                                        <i className="bx bx-map mr-1"></i>
                                        {candidate.location}
                                    </span>
                                )}
                                {totalYears > 0 && (
                                    <span className="flex items-center">
                                        <i className="bx bx-briefcase mr-1"></i>
                                        {totalYears} years experience
                                    </span>
                                )}
                                {candidate.email && (
                                    <span className="flex items-center">
                                        <i className="bx bx-envelope mr-1"></i>
                                        {candidate.email}
                                    </span>
                                )}
                            </div>

                            {/* Skills */}
                            {skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {skills.slice(0, 5).map((skill, index) => (
                                        <span key={index} className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                    {skills.length > 5 && (
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                                            +{skills.length - 5} more
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Bio Preview */}
                            {candidate.bio && (
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                                    {candidate.bio}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        <Link
                            href={`/candidates/${candidate.id}`}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center mb-4">
                <img
                    src={candidate.profile_image || '/assets/img/avatar-placeholder.png'}
                    alt={`${candidate.first_name} ${candidate.last_name}`}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 hover:text-purple-600">
                    <Link href={`/candidates/${candidate.id}`}>
                        {candidate.first_name} {candidate.last_name}
                    </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{candidate.job_title || 'Professional'}</p>
                {profile.available_for_hire && (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium mb-3">
                        Available for Hire
                    </span>
                )}
            </div>

            <div className="space-y-2 mb-4">
                {candidate.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <i className="bx bx-map mr-2 text-purple-500"></i>
                        <span>{candidate.location}</span>
                    </div>
                )}
                {totalYears > 0 && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <i className="bx bx-briefcase mr-2 text-blue-500"></i>
                        <span>{totalYears} years experience</span>
                    </div>
                )}
                {candidate.email && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <i className="bx bx-envelope mr-2 text-green-500"></i>
                        <span className="truncate">{candidate.email}</span>
                    </div>
                )}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                            {skill}
                        </span>
                    ))}
                    {skills.length > 3 && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                            +{skills.length - 3} more
                        </span>
                    )}
                </div>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <Link
                    href={`/candidates/${candidate.id}`}
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center px-4 py-2 rounded-lg transition-colors"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}