import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistanceToNow } from 'date-fns';

export default function Show({ candidate }) {
    const { auth } = usePage().props;
    const profile = candidate.candidate_profile || {};
    const skills = profile.skills || [];
    const experience = profile.experience || [];
    const education = profile.education || [];
    const certifications = profile.certifications || [];

    // Calculate total years of experience
    const totalYears = experience.reduce((total, exp) => {
        const years = parseInt(exp.years) || 0;
        return total + years;
    }, 0);

    const [isContacting, setIsContacting] = useState(false);

    const handleContact = async () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        setIsContacting(true);
        try {
            // Handle contact logic here
            await router.post(`/candidates/${candidate.id}/contact`);
        } catch (error) {
            console.error('Error contacting candidate:', error);
        } finally {
            setIsContacting(false);
        }
    };

    return (
        <AppLayout>
            <Head title={`${candidate.first_name} ${candidate.last_name} - Candidate Profile`} />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 text-sm mb-4">
                            <Link href="/candidates" className="hover:text-purple-200">Candidates</Link>
                            <i className="bx bx-chevron-right"></i>
                            <span>{candidate.first_name} {candidate.last_name}</span>
                        </div>
                        <div className="flex items-center justify-center mb-6">
                            <img
                                src={candidate.profile_image || '/assets/img/avatar-placeholder.png'}
                                alt={`${candidate.first_name} ${candidate.last_name}`}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            {candidate.first_name} {candidate.last_name}
                        </h1>
                        <p className="text-xl text-purple-100 mb-6">{candidate.job_title || 'Professional'}</p>
                        <div className="flex items-center justify-center gap-6 text-lg flex-wrap">
                            {candidate.location && (
                                <div className="flex items-center gap-2">
                                    <i className="bx bx-map-pin"></i>
                                    <span>{candidate.location}</span>
                                </div>
                            )}
                            {totalYears > 0 && (
                                <div className="flex items-center gap-2">
                                    <i className="bx bx-briefcase"></i>
                                    <span>{totalYears} years experience</span>
                                </div>
                            )}
                            {profile.available_for_hire && (
                                <div className="flex items-center gap-2">
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Available for Hire
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                {/* About Section */}
                                {candidate.bio && (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About</h2>
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                                {candidate.bio}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Skills Section */}
                                {skills.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills</h2>
                                        <div className="flex flex-wrap gap-3">
                                            {skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Experience Section */}
                                {experience.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Work Experience</h2>
                                        <div className="space-y-6">
                                            {experience.map((exp, index) => (
                                                <div key={index} className="relative pl-8 border-l-2 border-purple-200 dark:border-purple-700">
                                                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-600"></div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {exp.position || exp.title}
                                                    </h3>
                                                    <p className="text-purple-600 dark:text-purple-400 font-medium mb-1">
                                                        {exp.company}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {exp.start_date} - {exp.end_date || 'Present'}
                                                        {exp.years && ` (${exp.years} years)`}
                                                    </p>
                                                    {exp.description && (
                                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                                            {exp.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education Section */}
                                {education.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Education</h2>
                                        <div className="space-y-6">
                                            {education.map((edu, index) => (
                                                <div key={index} className="relative pl-8 border-l-2 border-blue-200 dark:border-blue-700">
                                                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {edu.degree || edu.qualification}
                                                    </h3>
                                                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                                                        {edu.institution || edu.school}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {edu.start_date} - {edu.end_date || 'Present'}
                                                    </p>
                                                    {edu.description && (
                                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                            {edu.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Certifications Section */}
                                {certifications.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Certifications</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {certifications.map((cert, index) => (
                                                <div
                                                    key={index}
                                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                                                            <i className="bx bx-certification text-green-600 dark:text-green-400 text-xl"></i>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                                {cert.name || cert.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {cert.issuer || cert.organization}
                                                            </p>
                                                            {cert.date && (
                                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                                    Issued {cert.date}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                {/* Contact Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
                                    <div className="space-y-4 mb-6">
                                        {candidate.email && (
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                                                    <i className="bx bx-envelope text-purple-600 dark:text-purple-400"></i>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                                                        {candidate.email}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {candidate.phone_number && (
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                                                    <i className="bx bx-phone text-blue-600 dark:text-blue-400"></i>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {candidate.phone_number}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {candidate.location && (
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                                                    <i className="bx bx-map text-green-600 dark:text-green-400"></i>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Location</p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {candidate.location}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleContact}
                                        disabled={isContacting}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
                                    >
                                        {isContacting ? (
                                            <>
                                                <i className="bx bx-loader-alt bx-spin mr-2"></i>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bx bx-send mr-2"></i>
                                                Contact Candidate
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Profile Links */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Links</h3>
                                    <div className="space-y-3">
                                        {profile.linkedin_url && (
                                            <a
                                                href={profile.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                            >
                                                <i className="bx bxl-linkedin-square text-blue-600 text-2xl"></i>
                                                <span className="text-gray-900 dark:text-white font-medium">LinkedIn Profile</span>
                                            </a>
                                        )}
                                        {profile.github_url && (
                                            <a
                                                href={profile.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                            >
                                                <i className="bx bxl-github text-gray-900 dark:text-white text-2xl"></i>
                                                <span className="text-gray-900 dark:text-white font-medium">GitHub Profile</span>
                                            </a>
                                        )}
                                        {profile.portfolio_url && (
                                            <a
                                                href={profile.portfolio_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                            >
                                                <i className="bx bx-globe text-purple-600 text-2xl"></i>
                                                <span className="text-gray-900 dark:text-white font-medium">Portfolio Website</span>
                                            </a>
                                        )}
                                        {profile.resume && (
                                            <a
                                                href={profile.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                            >
                                                <i className="bx bx-file text-green-600 text-2xl"></i>
                                                <span className="text-gray-900 dark:text-white font-medium">Download Resume</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Candidate Stats */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {totalYears > 0 ? `${totalYears} years` : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Skills:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {skills.length} skills
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Education:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {education.length} {education.length === 1 ? 'degree' : 'degrees'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Certifications:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {certifications.length}
                                            </span>
                                        </div>
                                        {candidate.last_active_at && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Last Active:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {formatDistanceToNow(new Date(candidate.last_active_at))} ago
                                                </span>
                                            </div>
                                        )}
                                        {candidate.created_at && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Member Since:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {formatDistanceToNow(new Date(candidate.created_at))} ago
                                                </span>
                                            </div>
                                        )}
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