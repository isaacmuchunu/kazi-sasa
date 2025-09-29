import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Account({ user }) {
    const menuItems = [
        {
            title: 'Dashboard',
            description: 'Overview of your account',
            href: '/account',
            icon: 'bx-tachometer',
            active: true
        },
        {
            title: 'My Profile',
            description: 'Update your personal information',
            href: '/account/profile',
            icon: 'bx-user'
        },
        {
            title: 'Applied Jobs',
            description: 'Jobs you have applied for',
            href: '/account/applied-jobs',
            icon: 'bx-send'
        },
        {
            title: 'Saved Jobs',
            description: 'Jobs you have bookmarked',
            href: '/account/saved-jobs',
            icon: 'bx-bookmark'
        },
        {
            title: 'Messages',
            description: 'Your conversations',
            href: '/account/messages',
            icon: 'bx-message'
        },
        {
            title: 'Change Password',
            description: 'Update your password',
            href: '/account/change-password',
            icon: 'bx-lock'
        }
    ];

    return (
        <AppLayout>
            <Head title="Account Dashboard" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Account Dashboard</h1>
                        <p className="text-xl text-blue-100">
                            Welcome back, {user.first_name}! Manage your job search and account settings.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                        <i className="bx bx-send text-2xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">Applied Jobs</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                        <i className="bx bx-bookmark text-2xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">Saved Jobs</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                                        <i className="bx bx-time text-2xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">Member Since</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Menu */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={`block p-6 rounded-lg border transition-all hover:shadow-lg ${
                                            item.active
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-full ${
                                                item.active
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                                <i className={`${item.icon} text-xl`}></i>
                                            </div>
                                            <div>
                                                <h3 className={`font-semibold mb-1 ${
                                                    item.active
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-900 dark:text-white'
                                                }`}>
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Recent Activity</h2>
                            <div className="text-center py-12">
                                <i className="bx bx-time-five text-6xl text-gray-300 mb-4"></i>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No Recent Activity
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Your recent account activity will appear here.
                                </p>
                                <Link
                                    href="/jobs"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    <i className="bx bx-search"></i>
                                    Browse Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
