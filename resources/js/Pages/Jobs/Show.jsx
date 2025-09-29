import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistanceToNow } from 'date-fns';

export default function Show({ job, relatedJobs = [] }) {
    const { auth } = usePage().props;
    const [isApplying, setIsApplying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasApplied, setHasApplied] = useState(job.has_applied || false);
    const [isSaved, setIsSaved] = useState(job.is_saved || false);

    const handleApply = async () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        setIsApplying(true);
        try {
            await router.post(`/jobs/${job.id}/apply`);
            setHasApplied(true);
        } catch (error) {
            console.error('Error applying for job:', error);
        } finally {
            setIsApplying(false);
        }
    };

    const handleSave = async () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        setIsSaving(true);
        try {
            if (isSaved) {
                await router.delete(`/jobs/${job.id}/unsave`);
                setIsSaved(false);
            } else {
                await router.post(`/jobs/${job.id}/save`);
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Error saving job:', error);
        } finally {
            setIsSaving(false);
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
            return `${formatAmount(min)} - ${formatAmount(max)} ${period}`;
        } else if (min) {
            return `${formatAmount(min)}+ ${period}`;
        } else {
            return `Up to ${formatAmount(max)} ${period}`;
        }
    };

    return (
        <AppLayout>
            <Head title={`${job.title} - ${job.company.name}`} />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 text-sm mb-4">
                            <Link href="/jobs" className="hover:text-blue-200">Jobs</Link>
                            <i className="bx bx-chevron-right"></i>
                            <span>{job.category.name}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{job.title}</h1>
                        <div className="flex items-center justify-center gap-4 text-lg">
                            <div className="flex items-center gap-2">
                                <i className="bx bx-building"></i>
                                <span>{job.company.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="bx bx-map-pin"></i>
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="bx bx-time"></i>
                                <span>{formatDistanceToNow(new Date(job.created_at))} ago</span>
                            </div>
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
                                {/* Job Details Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={job.company.logo || '/assets/img/company-placeholder.png'}
                                                alt={job.company.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h2>
                                                <p className="text-gray-600 dark:text-gray-300">{job.company.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {job.is_urgent && (
                                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                                    Urgent
                                                </span>
                                            )}
                                            {job.is_featured && (
                                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <i className="bx bx-money text-2xl text-green-600 mb-2"></i>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Salary</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {formatSalary(job.salary_min, job.salary_max, job.salary_period)}
                                            </p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <i className="bx bx-briefcase text-2xl text-blue-600 mb-2"></i>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Job Type</p>
                                            <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                                {job.job_type.replace('_', ' ')}
                                            </p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <i className="bx bx-user-check text-2xl text-purple-600 mb-2"></i>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Experience</p>
                                            <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                                {job.experience_level.replace('_', ' ')}
                                            </p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <i className="bx bx-calendar text-2xl text-orange-600 mb-2"></i>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Applications</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {job.applications_count || 0}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            {job.category.name}
                                        </span>
                                        {job.skills_required && job.skills_required.map((skill, index) => (
                                            <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleApply}
                                            disabled={isApplying || hasApplied || !job.status || job.status !== 'active'}
                                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                                                hasApplied || !job.status || job.status !== 'active'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                        >
                                            {isApplying ? (
                                                <>
                                                    <i className="bx bx-loader-alt bx-spin mr-2"></i>
                                                    Applying...
                                                </>
                                            ) : hasApplied ? (
                                                <>
                                                    <i className="bx bx-check mr-2"></i>
                                                    Applied
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bx bx-send mr-2"></i>
                                                    Apply Now
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className={`px-6 py-3 rounded-lg font-semibold transition-colors border ${
                                                isSaved
                                                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                                                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            {isSaving ? (
                                                <i className="bx bx-loader-alt bx-spin"></i>
                                            ) : isSaved ? (
                                                <i className="bx bx-bookmark-minus"></i>
                                            ) : (
                                                <i className="bx bx-bookmark-plus"></i>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Job Description</h3>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                            {job.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Skills Required */}
                                {job.skills_required && job.skills_required.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills Required</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills_required.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                {/* Company Info */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Company Info</h3>
                                    <div className="text-center">
                                        <img
                                            src={job.company.logo || '/assets/img/company-placeholder.png'}
                                            alt={job.company.name}
                                            className="w-20 h-20 rounded-lg object-cover mx-auto mb-4"
                                        />
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {job.company.name}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            {job.company.industry}
                                        </p>
                                        <Link
                                            href={`/companies/${job.company.slug}`}
                                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            View Company
                                            <i className="bx bx-chevron-right"></i>
                                        </Link>
                                    </div>
                                </div>

                                {/* Job Summary */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">Location:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{job.location}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">Job Type:</span>
                                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                                                {job.job_type.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">Experience:</span>
                                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                                                {job.experience_level.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">Applications:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {job.applications_count || 0}
                                            </span>
                                        </div>
                                        {job.apply_deadline && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">Deadline:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {new Date(job.apply_deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Share Job */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Share This Job</h3>
                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                            <i className="bx bxl-facebook"></i>
                                            Facebook
                                        </button>
                                        <button className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                            <i className="bx bxl-twitter"></i>
                                            Twitter
                                        </button>
                                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                            <i className="bx bxl-whatsapp"></i>
                                            WhatsApp
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Jobs */}
                        {relatedJobs.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Jobs</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {relatedJobs.map((relatedJob) => (
                                        <div key={relatedJob.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={relatedJob.company.logo || '/assets/img/company-placeholder.png'}
                                                    alt={relatedJob.company.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                        <Link href={`/jobs/${relatedJob.slug}`} className="hover:text-blue-600">
                                                            {relatedJob.title}
                                                        </Link>
                                                    </h4>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                                        {relatedJob.company.name}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <i className="bx bx-map-pin"></i>
                                                            {relatedJob.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <i className="bx bx-time"></i>
                                                            {formatDistanceToNow(new Date(relatedJob.created_at))} ago
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
