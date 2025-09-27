import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function FeaturedJobsSection({ jobs = [] }) {
    const [activeFilter, setActiveFilter] = useState('all');

    // Sample featured jobs if none provided
    const defaultJobs = [
        {
            id: 1,
            title: 'Senior Software Engineer',
            company: { name: 'TechCorp Kenya', logo: '/assets/img/company-logo/1.png' },
            location: 'Nairobi, Kenya',
            job_type: 'Full-time',
            salary_range: '$2,000 - $3,500',
            is_featured: true,
            is_urgent: false,
            posted_ago: '2 days ago',
            slug: 'senior-software-engineer-techcorp',
            category: 'technology'
        },
        {
            id: 2,
            title: 'Digital Marketing Manager',
            company: { name: 'Creative Agency', logo: '/assets/img/company-logo/2.png' },
            location: 'Mombasa, Kenya',
            job_type: 'Full-time',
            salary_range: '$1,500 - $2,500',
            is_featured: true,
            is_urgent: true,
            posted_ago: '1 day ago',
            slug: 'digital-marketing-manager-creative',
            category: 'marketing'
        },
        {
            id: 3,
            title: 'Financial Analyst',
            company: { name: 'Kenya Bank', logo: '/assets/img/company-logo/3.png' },
            location: 'Nairobi, Kenya',
            job_type: 'Full-time',
            salary_range: '$1,800 - $2,800',
            is_featured: true,
            is_urgent: false,
            posted_ago: '3 days ago',
            slug: 'financial-analyst-kenya-bank',
            category: 'finance'
        },
        {
            id: 4,
            title: 'Registered Nurse',
            company: { name: 'City Hospital', logo: '/assets/img/company-logo/4.png' },
            location: 'Kisumu, Kenya',
            job_type: 'Full-time',
            salary_range: '$1,200 - $2,000',
            is_featured: true,
            is_urgent: true,
            posted_ago: '1 day ago',
            slug: 'registered-nurse-city-hospital',
            category: 'healthcare'
        },
        {
            id: 5,
            title: 'Elementary Teacher',
            company: { name: 'International School', logo: '/assets/img/company-logo/5.png' },
            location: 'Nakuru, Kenya',
            job_type: 'Full-time',
            salary_range: '$800 - $1,500',
            is_featured: true,
            is_urgent: false,
            posted_ago: '4 days ago',
            slug: 'elementary-teacher-international',
            category: 'education'
        },
        {
            id: 6,
            title: 'UX/UI Designer',
            company: { name: 'Design Studio', logo: '/assets/img/company-logo/6.png' },
            location: 'Remote',
            job_type: 'Contract',
            salary_range: '$1,000 - $2,000',
            is_featured: true,
            is_urgent: false,
            posted_ago: '2 days ago',
            slug: 'ux-ui-designer-design-studio',
            category: 'design'
        }
    ];

    const displayJobs = jobs.length > 0 ? jobs : defaultJobs;

    const filters = [
        { key: 'all', label: 'All Jobs', count: displayJobs.length },
        { key: 'urgent', label: 'Urgent', count: displayJobs.filter(job => job.is_urgent).length },
        { key: 'remote', label: 'Remote', count: displayJobs.filter(job => job.location.toLowerCase().includes('remote')).length },
        { key: 'full-time', label: 'Full-time', count: displayJobs.filter(job => job.job_type === 'Full-time').length }
    ];

    const filteredJobs = displayJobs.filter(job => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'urgent') return job.is_urgent;
        if (activeFilter === 'remote') return job.location.toLowerCase().includes('remote');
        if (activeFilter === 'full-time') return job.job_type === 'Full-time';
        return true;
    });

    return (
        <section className="featured-jobs-section py-16 lg:py-24 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="section-header flex flex-col lg:flex-row items-center justify-between mb-12">
                    <div className="section-title mb-6 lg:mb-0">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Featured Jobs
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Discover premium job opportunities from top companies
                        </p>
                    </div>

                    {/* Job Filters */}
                    <div className="job-filters flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    activeFilter === filter.key
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {filter.label}
                                <span className="ml-1 text-xs opacity-75">({filter.count})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Jobs Grid */}
                <div className="jobs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredJobs.slice(0, 6).map((job, index) => (
                        <JobCard key={job.id} job={job} delay={index * 100} />
                    ))}
                </div>

                {/* View All Jobs Button */}
                <div className="text-center">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <span>View All Jobs</span>
                        <i className="bx bx-right-arrow-alt ml-2 text-xl"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function JobCard({ job, delay = 0 }) {
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

    return (
        <div
            className="job-card group animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                {/* Job Header */}
                <div className="job-header flex items-start justify-between mb-4">
                    <div className="company-info flex items-center gap-3">
                        <div className="company-logo">
                            <img
                                src={job.company.logo || '/assets/img/company-logo/default.png'}
                                alt={job.company.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                    e.target.src = '/assets/img/company-logo/default.png';
                                }}
                            />
                        </div>
                        <div>
                            <p className="company-name text-sm text-gray-600 dark:text-gray-400">
                                {job.company.name}
                            </p>
                            <p className="posted-date text-xs text-gray-500">
                                {job.posted_ago}
                            </p>
                        </div>
                    </div>

                    {/* Job Badges */}
                    <div className="job-badges flex flex-col gap-2">
                        {job.is_featured && (
                            <span className="badge bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                                Featured
                            </span>
                        )}
                        {job.is_urgent && (
                            <span className="badge bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                                Urgent
                            </span>
                        )}
                    </div>
                </div>

                {/* Job Title */}
                <h3 className="job-title text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link href={`/jobs/${job.slug}`}>
                        {job.title}
                    </Link>
                </h3>

                {/* Job Details */}
                <div className="job-details space-y-2 mb-4">
                    <div className="job-location flex items-center text-gray-600 dark:text-gray-400">
                        <i className="bx bx-map mr-2 text-blue-500"></i>
                        <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="job-type flex items-center text-gray-600 dark:text-gray-400">
                        <i className="bx bx-time mr-2 text-green-500"></i>
                        <span className="text-sm">{job.job_type}</span>
                    </div>
                    <div className="salary-range flex items-center text-gray-600 dark:text-gray-400">
                        <i className="bx bx-dollar mr-2 text-yellow-500"></i>
                        <span className="text-sm font-medium">{job.salary_range}</span>
                    </div>
                </div>

                {/* Job Actions */}
                <div className="job-actions flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={handleSaveJob}
                        className={`save-btn p-2 rounded-lg transition-all duration-300 ${
                            isSaved
                                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                        title="Save Job"
                    >
                        <i className={`bx ${isSaved ? 'bxs-heart' : 'bx-heart'} text-xl`}></i>
                    </button>

                    <Link
                        href={`/jobs/${job.slug}`}
                        className="apply-btn px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </div>
    );
}