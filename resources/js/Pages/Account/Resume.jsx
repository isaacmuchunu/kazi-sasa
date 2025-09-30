import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistanceToNow } from 'date-fns';

export default function Resume({ resumes = [] }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        resume_file: null,
        title: '',
        is_default: false,
    });

    const [uploadingFile, setUploadingFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];

            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF or Word document');
                return;
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                return;
            }

            setData('resume_file', file);
            setUploadingFile({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                type: file.type,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/account/resume/upload', {
            onSuccess: () => {
                setData({
                    resume_file: null,
                    title: '',
                    is_default: false,
                });
                setUploadingFile(null);
            },
        });
    };

    const handleDelete = (resumeId) => {
        if (confirm('Are you sure you want to delete this resume?')) {
            router.delete(`/account/resume/${resumeId}`);
        }
    };

    const handleSetDefault = (resumeId) => {
        router.post(`/account/resume/${resumeId}/set-default`);
    };

    const getFileIcon = (fileType) => {
        if (fileType?.includes('pdf')) {
            return 'bx-file-pdf text-red-500';
        }
        return 'bx-file-doc text-blue-500';
    };

    return (
        <AppLayout>
            <Head title="Resume" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Resume Management</h1>
                        <p className="text-xl text-blue-100">
                            Upload and manage your resumes. Keep them updated for job applications.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Upload Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Upload New Resume
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* File Upload Area */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Resume File *
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            id="resume-upload"
                                            disabled={processing}
                                        />
                                        <label
                                            htmlFor="resume-upload"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            {uploadingFile ? (
                                                <div className="w-full">
                                                    <i className="bx bx-file text-5xl text-blue-500 mb-4"></i>
                                                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                                                        {uploadingFile.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                        {uploadingFile.size}
                                                    </p>
                                                    {progress && (
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${progress.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setUploadingFile(null);
                                                            setData('resume_file', null);
                                                        }}
                                                        className="text-sm text-red-500 hover:text-red-700"
                                                    >
                                                        Remove file
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <i className="bx bx-cloud-upload text-6xl text-gray-400 mb-4"></i>
                                                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                                                        Click to upload or drag and drop
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        PDF, DOC, or DOCX (max 5MB)
                                                    </p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {errors.resume_file && (
                                        <p className="text-red-500 text-sm mt-2">{errors.resume_file}</p>
                                    )}
                                </div>

                                {/* Resume Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Resume Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Software Engineer Resume 2024"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        required
                                        disabled={processing}
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                    )}
                                </div>

                                {/* Set as Default */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_default"
                                        checked={data.is_default}
                                        onChange={(e) => setData('is_default', e.target.checked)}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        disabled={processing}
                                    />
                                    <label htmlFor="is_default" className="text-sm text-gray-700 dark:text-gray-300">
                                        Set as default resume for applications
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.resume_file}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <i className="bx bx-loader-alt bx-spin"></i>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bx bx-upload"></i>
                                                Upload Resume
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Resumes List */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Your Resumes
                            </h2>

                            {resumes.length > 0 ? (
                                <div className="space-y-4">
                                    {resumes.map((resume) => (
                                        <div
                                            key={resume.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <i className={`bx ${getFileIcon(resume.file_type)} text-4xl`}></i>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                                                                {resume.title}
                                                                {resume.is_default && (
                                                                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                                        Default
                                                                    </span>
                                                                )}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Uploaded {formatDistanceToNow(new Date(resume.created_at))} ago
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                                        <span className="flex items-center gap-1">
                                                            <i className="bx bx-file"></i>
                                                            {resume.file_name}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{resume.file_size}</span>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <a
                                                            href={resume.download_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                                                        >
                                                            <i className="bx bx-download"></i>
                                                            Download
                                                        </a>
                                                        <a
                                                            href={resume.view_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                                                        >
                                                            <i className="bx bx-show"></i>
                                                            Preview
                                                        </a>
                                                        {!resume.is_default && (
                                                            <button
                                                                onClick={() => handleSetDefault(resume.id)}
                                                                className="inline-flex items-center gap-2 border border-green-300 hover:bg-green-50 dark:border-green-600 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                                                            >
                                                                <i className="bx bx-check"></i>
                                                                Set as Default
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(resume.id)}
                                                            className="inline-flex items-center gap-2 border border-red-300 hover:bg-red-50 dark:border-red-600 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                                                        >
                                                            <i className="bx bx-trash"></i>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <i className="bx bx-file text-8xl text-gray-300 mb-4"></i>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        No Resumes Yet
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Upload your first resume to get started with applications
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Resume Tips */}
                        <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                📄 Resume Best Practices
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                        Resume Content
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Keep it concise (1-2 pages maximum)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Use clear, professional formatting
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Include relevant work experience
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Highlight key achievements with metrics
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                        File Management
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            PDF format is recommended
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Use descriptive file names
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Keep multiple versions for different roles
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bx bx-check text-green-500"></i>
                                            Update regularly with new experience
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