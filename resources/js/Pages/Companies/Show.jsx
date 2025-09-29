import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistanceToNow } from 'date-fns';

export default function Show({ company, jobs = [] }) {
    return (
        <AppLayout>
            <Head title={`${company.name} - Company Profile`} />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 text-sm mb-4">
                            <Link href="/companies" className="hover:text-blue-200">Companies</Link>
                            <i className="bx bx-chevron-right"></i>
                            <span>{company.name}</span>
                        </div>
                        <div className="flex items-center justify-center mb-6">
                            <img
                                src={company.logo || '/assets/img/company-placeholder.png'}
                                alt={company.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{company.name}</h1>
                        <p className="text-xl text-blue-100 mb-6">{company.industry}</p>
                        <div className="flex items-center justify-center gap-6 text-lg">
                            <div className="flex items-center gap-2">
                                <i className="bx bx-map-pin"></i>
                                <span>{company.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="bx bx-building"></i>
                                <span>{company.size} employees</span>
                            </div>
                            {company.website && (
                                <div className="flex items-center gap-2">
                                    <i className="bx bx-globe"></i>
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">
                                        Website
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                {/* Company Description */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About Company</h2>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {company.description || 'No description available for this company.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Company Jobs */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                        Open Positions ({jobs.length})
                                    </h2>

                                    {jobs.length > 0 ? (
                                        <div className="space-y-6">
                                            {jobs.map((job) => (
                                                <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                                    <Link href={`/jobs/${job.slug}`} className="hover:text-blue-600">
                                                                        {job.title}
                                                                    </Link>
                                                                </h3>
                                                                {job.is_featured && (
                                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                                        Featured
                                                                    </span>
                                                                )}
                                                                {job.is_urgent && (
                                                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                                                        Urgent
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                                <span className="flex items-center gap-1">
                                                                    <i className="bx bx-map-pin"></i>
                                                                    {job.location}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <i className="bx bx-time"></i>
                                                                    {formatDistanceToNow(new Date(job.created_at))} ago
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <i className="bx bx-briefcase"></i>
                                                                    {job.job_type.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                            {job.salary_min || job.salary_max ? (
                                                                <div className="flex items-center gap-2 text-sm text-green-600 font-medium mb-3">
                                                                    <i className="bx bx-money"></i>
                                                                    {job.salary_min && job.salary_max
                                                                        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                                                                        : job.salary_min
                                                                            ? `$${job.salary_min.toLocaleString()}+`
                                                                            : `Up to $${job.salary_max.toLocaleString()}`
                                                                    } {job.salary_period}
                                                                </div>
                                                            ) : null}
                                                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                                                                {job.description?.substring(0, 150)}...
                                                            </p>
                                                        </div>
                                                        <div className="ml-4">
                                                            <Link
                                                                href={`/jobs/${job.slug}`}
                                                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                            >
                                                                View Job
                                                                <i className="bx bx-chevron-right"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <i className="bx bx-briefcase text-6xl text-gray-300 mb-4"></i>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                No Open Positions
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                This company doesn't have any open positions at the moment.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                {/* Company Stats */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Company Overview</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-300">Industry:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{company.industry}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-300">Company Size:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{company.size} employees</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-300">Location:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{company.location}</span>
                                        </div>
                                        {company.website && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300">Website:</span>
                                                <a
                                                    href={company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-blue-600 hover:text-blue-700"
                                                >
                                                    Visit Website
                                                </a>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-300">Member Since:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatDistanceToNow(new Date(company.created_at))} ago
                                            </span>
                                        </div>
                                        {company.is_verified && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                                                    <i className="bx bx-check-circle"></i>
                                                    Verified
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                            <i className="bx bx-bell"></i>
                                            Follow Company
                                        </button>
                                        <button className="w-full border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                            <i className="bx bx-share"></i>
                                            Share Company
                                        </button>
                                    </div>
                                </div>

                                {/* Similar Companies */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Similar Companies</h3>
                                    <div className="text-center py-8">
                                        <i className="bx bx-building-house text-4xl text-gray-300 mb-3"></i>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Similar companies will be shown here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
