import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Create({ categories = [], auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        company_id: auth.user?.company_id || '',
        job_category_id: '',
        description: '',
        requirements: '',
        location: '',
        job_type: 'full_time',
        experience_level: 'mid_level',
        salary_min: '',
        salary_max: '',
        salary_period: 'month',
        apply_deadline: '',
        skills_required: '',
        tags: '',
        status: 'active',
        is_featured: false,
        is_urgent: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            ...data,
            skills_required: data.skills_required ? data.skills_required.split(',').map(s => s.trim()) : [],
            tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        };

        post('/jobs', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title="Post a Job" />

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 text-sm mb-4">
                            <Link href="/" className="hover:text-blue-200">Home</Link>
                            <i className="bx bx-chevron-right"></i>
                            <Link href="/jobs" className="hover:text-blue-200">Jobs</Link>
                            <i className="bx bx-chevron-right"></i>
                            <span>Post a Job</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Post a New Job</h1>
                        <p className="text-blue-100">Fill in the details to attract the best candidates</p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                            {/* Job Information */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Job Information</h2>

                                {/* Job Title */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        Job Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g. Senior Full Stack Developer"
                                        required
                                    />
                                    {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
                                </div>

                                {/* Category */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.job_category_id}
                                        onChange={e => setData('job_category_id', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.job_category_id && <p className="mt-2 text-sm text-red-500">{errors.job_category_id}</p>}
                                </div>

                                {/* Location */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g. Nairobi, Kenya or Remote"
                                        required
                                    />
                                    {errors.location && <p className="mt-2 text-sm text-red-500">{errors.location}</p>}
                                </div>

                                {/* Job Type and Experience Level */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                            Job Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.job_type}
                                            onChange={e => setData('job_type', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="full_time">Full-time</option>
                                            <option value="part_time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="freelance">Freelance</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                        {errors.job_type && <p className="mt-2 text-sm text-red-500">{errors.job_type}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                            Experience Level <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.experience_level}
                                            onChange={e => setData('experience_level', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="entry_level">Entry Level</option>
                                            <option value="mid_level">Mid Level</option>
                                            <option value="senior_level">Senior Level</option>
                                            <option value="executive">Executive</option>
                                        </select>
                                        {errors.experience_level && <p className="mt-2 text-sm text-red-500">{errors.experience_level}</p>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        Job Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows="8"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Provide a detailed description of the job role, responsibilities, and company culture..."
                                        required
                                    ></textarea>
                                    {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description}</p>}
                                </div>

                                {/* Requirements */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        Requirements
                                    </label>
                                    <textarea
                                        value={data.requirements}
                                        onChange={e => setData('requirements', e.target.value)}
                                        rows="6"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="List the qualifications, skills, and experience required..."
                                    ></textarea>
                                    {errors.requirements && <p className="mt-2 text-sm text-red-500">{errors.requirements}</p>}
                                </div>
                            </div>

                            {/* Salary Information */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Salary Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                            Minimum Salary
                                        </label>
                                        <input
                                            type="number"
                                            value={data.salary_min}
                                            onChange={e => setData('salary_min', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="50000"
                                        />
                                        {errors.salary_min && <p className="mt-2 text-sm text-red-500">{errors.salary_min}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                            Maximum Salary
                                        </label>
                                        <input
                                            type="number"
                                            value={data.salary_max}
                                            onChange={e => setData('salary_max', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="100000"
                                        />
                                        {errors.salary_max && <p className="mt-2 text-sm text-red-500">{errors.salary_max}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                            Period
                                        </label>
                                        <select
                                            value={data.salary_period}
                                            onChange={e => setData('salary_period', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="hour">Per Hour</option>
                                            <option value="day">Per Day</option>
                                            <option value="week">Per Week</option>
                                            <option value="month">Per Month</option>
                                            <option value="year">Per Year</option>
                                        </select>
                                        {errors.salary_period && <p className="mt-2 text-sm text-red-500">{errors.salary_period}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Additional Information</h2>

                                {/* Skills Required */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        Skills Required
                                    </label>
                                    <input
                                        type="text"
                                        value={data.skills_required}
                                        onChange={e => setData('skills_required', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g. React, Node.js, TypeScript (comma-separated)"
                                    />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Separate multiple skills with commas</p>
                                    {errors.skills_required && <p className="mt-2 text-sm text-red-500">{errors.skills_required}</p>}
                                </div>

                                {/* Tags */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tags}
                                        onChange={e => setData('tags', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g. remote, startup, flexible (comma-separated)"
                                    />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Separate multiple tags with commas</p>
                                    {errors.tags && <p className="mt-2 text-sm text-red-500">{errors.tags}</p>}
                                </div>

                                {/* Application Deadline */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        Application Deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={data.apply_deadline}
                                        onChange={e => setData('apply_deadline', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.apply_deadline && <p className="mt-2 text-sm text-red-500">{errors.apply_deadline}</p>}
                                </div>

                                {/* Status and Flags */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="active">Active</option>
                                            <option value="draft">Draft</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                        {errors.status && <p className="mt-2 text-sm text-red-500">{errors.status}</p>}
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_featured}
                                                onChange={e => setData('is_featured', e.target.checked)}
                                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-gray-700 dark:text-gray-300">Featured Job</span>
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_urgent}
                                                onChange={e => setData('is_urgent', e.target.checked)}
                                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-gray-700 dark:text-gray-300">Urgent Hiring</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <i className="bx bx-loader-alt bx-spin"></i>
                                            <span>Publishing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bx bx-send"></i>
                                            <span>Publish Job</span>
                                        </>
                                    )}
                                </button>

                                <Link
                                    href="/jobs"
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <i className="bx bx-x"></i>
                                    <span>Cancel</span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}