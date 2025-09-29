import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistanceToNow } from 'date-fns';

export default function SavedJobs({ savedJobs = [] }) {
    return (
        <AppLayout>
            <Head title="Saved Jobs" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Saved Jobs</h1>
                        <p className="text-xl text-blue-100">
                            Jobs you've bookmarked for later. Keep track of opportunities that interest you.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {savedJobs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedJobs.map((savedJob) => (
                                    <div key={savedJob.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={savedJob.job.company.logo || '/assets/img/company-placeholder.png'}
                                                alt={savedJob.job.company.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        <Link href={`/jobs/${savedJob.job.slug}`} className="hover:text-blue-600">
                                                            {savedJob.job.title}
                                                        </Link>
                                                    </h3>
                                                    <button className="text-red-500 hover:text-red-600 p-1">
                                                        <i className="bx bx-trash text-lg"></i>
                                                    </button>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                                    {savedJob.job.company.name}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <i className="bx bx-map-pin"></i>
                                                        {savedJob.job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <i className="bx bx-time"></i>
                                                        Saved {formatDistanceToNow(new Date(savedJob.created_at))} ago
                                                    </span>
                                                </div>
                                                {savedJob.job.salary_min || savedJob.job.salary_max ? (
                                                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium mb-3">
                                                        <i className="bx bx-money"></i>
                                                        {savedJob.job.salary_min && savedJob.job.salary_max
                                                            ? `$${savedJob.job.salary_min.toLocaleString()} - $${savedJob.job.salary_max.toLocaleString()}`
                                                            : savedJob.job.salary_min
                                                                ? `$${savedJob.job.salary_min.toLocaleString()}+`
                                                                : `Up to $${savedJob.job.salary_max.toLocaleString()}`
                                                        } {savedJob.job.salary_period}
                                                    </div>
                                                ) : null}
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/jobs/${savedJob.job.slug}`}
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors"
                                                    >
                                                        View Job
                                                    </Link>
                                                    <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                                                        Apply Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <i className="bx bx-bookmark text-8xl text-gray-300 mb-6"></i>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    No Saved Jobs Yet
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                                    Start building your job collection by saving positions that interest you.
                                    This makes it easy to revisit and apply when you're ready.
                                </p>
                                <Link
                                    href="/jobs"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                                >
                                    <i className="bx bx-search"></i>
                                    Browse Jobs
                                </Link>
                            </div>
                        )}

                        {/* Tips Section */}
                        {savedJobs.length > 0 && (
                            <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    💡 Pro Tips for Job Hunting
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <i className="bx bx-calendar text-2xl"></i>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Set Reminders
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Set application deadlines for saved jobs to stay organized.
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <i className="bx bx-file text-2xl"></i>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Customize Applications
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Tailor your resume and cover letter for each application.
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <i className="bx bx-trending-up text-2xl"></i>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Follow Up
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Follow up on applications after 1-2 weeks if you haven't heard back.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
