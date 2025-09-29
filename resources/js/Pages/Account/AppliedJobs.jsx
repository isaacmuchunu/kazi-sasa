import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistanceToNow } from 'date-fns';

export default function AppliedJobs({ appliedJobs = [] }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'reviewing':
                return 'bg-blue-100 text-blue-800';
            case 'interviewed':
                return 'bg-purple-100 text-purple-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title="Applied Jobs" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Applied Jobs</h1>
                        <p className="text-xl text-blue-100">
                            Track your job applications and their status. Stay organized in your job search.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {appliedJobs.length > 0 ? (
                            <div className="space-y-6">
                                {appliedJobs.map((application) => (
                                    <div key={application.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <img
                                                    src={application.job.company.logo || '/assets/img/company-placeholder.png'}
                                                    alt={application.job.company.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                            <Link href={`/jobs/${application.job.slug}`} className="hover:text-blue-600">
                                                                {application.job.title}
                                                            </Link>
                                                        </h3>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                                                        {application.job.company.name}
                                                    </p>
                                                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                        <span className="flex items-center gap-1">
                                                            <i className="bx bx-map-pin"></i>
                                                            {application.job.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <i className="bx bx-calendar"></i>
                                                            Applied {formatDistanceToNow(new Date(application.created_at))} ago
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <i className="bx bx-time"></i>
                                                            {application.job.job_type.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    {application.job.salary_min || application.job.salary_max ? (
                                                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium mb-4">
                                                            <i className="bx bx-money"></i>
                                                            {application.job.salary_min && application.job.salary_max
                                                                ? `$${application.job.salary_min.toLocaleString()} - $${application.job.salary_max.toLocaleString()}`
                                                                : application.job.salary_min
                                                                    ? `$${application.job.salary_min.toLocaleString()}+`
                                                                    : `Up to $${application.job.salary_max.toLocaleString()}`
                                                            } {application.job.salary_period}
                                                        </div>
                                                    ) : null}
                                                    <div className="flex gap-3">
                                                        <Link
                                                            href={`/jobs/${application.job.slug}`}
                                                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                        >
                                                            <i className="bx bx-show"></i>
                                                            View Job
                                                        </Link>
                                                        <button className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors">
                                                            <i className="bx bx-message"></i>
                                                            Message
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <i className="bx bx-send text-8xl text-gray-300 mb-6"></i>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    No Applications Yet
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                                    You haven't applied to any jobs yet. Start your job search journey by browsing available positions.
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

                        {/* Application Tips */}
                        <div className="mt-16 bg-green-50 dark:bg-green-900/20 rounded-xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                📋 Application Best Practices
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Before Applying</h4>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Research the company and role thoroughly
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Tailor your resume for the specific job
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Write a customized cover letter
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Highlight relevant skills and experience
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">After Applying</h4>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Follow up after 1-2 weeks if no response
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Keep track of application dates
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Prepare for potential interviews
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Continue applying to other positions
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
