import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function ChangePassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/account/change-password', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        const checks = [
            password.length >= 8,
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password)
        ];

        strength = checks.filter(Boolean).length;

        const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];

        return {
            strength,
            label: labels[strength],
            color: colors[strength]
        };
    };

    const passwordStrength = getPasswordStrength(data.password);

    return (
        <AppLayout>
            <Head title="Change Password" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Change Password</h1>
                        <p className="text-xl text-blue-100">
                            Keep your account secure by updating your password regularly.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('current')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            <i className={`bx ${showPasswords.current ? 'bx-hide' : 'bx-show'}`}></i>
                                        </button>
                                    </div>
                                    {errors.current_password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.current_password}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            <i className={`bx ${showPasswords.new ? 'bx-hide' : 'bx-show'}`}></i>
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {data.password && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${
                                                            passwordStrength.strength <= 2 ? 'bg-red-500' :
                                                            passwordStrength.strength <= 3 ? 'bg-yellow-500' :
                                                            passwordStrength.strength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                                                        }`}
                                                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm New Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            <i className={`bx ${showPasswords.confirm ? 'bx-hide' : 'bx-show'}`}></i>
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {data.password_confirmation && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <i className={`bx ${data.password === data.password_confirmation ? 'bx-check text-green-500' : 'bx-x text-red-500'}`}></i>
                                            <span className={`text-sm ${data.password === data.password_confirmation ? 'text-green-600' : 'text-red-600'}`}>
                                                {data.password === data.password_confirmation ? 'Passwords match' : 'Passwords do not match'}
                                            </span>
                                        </div>
                                    )}

                                    {errors.password_confirmation && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Password Requirements:</h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                        <li className={`flex items-center gap-2 ${data.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                            <i className={`bx ${data.password.length >= 8 ? 'bx-check' : 'bx-minus'}`}></i>
                                            At least 8 characters long
                                        </li>
                                        <li className={`flex items-center gap-2 ${/[a-z]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <i className={`bx ${/[a-z]/.test(data.password) ? 'bx-check' : 'bx-minus'}`}></i>
                                            Contains lowercase letters
                                        </li>
                                        <li className={`flex items-center gap-2 ${/[A-Z]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <i className={`bx ${/[A-Z]/.test(data.password) ? 'bx-check' : 'bx-minus'}`}></i>
                                            Contains uppercase letters
                                        </li>
                                        <li className={`flex items-center gap-2 ${/[0-9]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <i className={`bx ${/[0-9]/.test(data.password) ? 'bx-check' : 'bx-minus'}`}></i>
                                            Contains numbers
                                        </li>
                                        <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <i className={`bx ${/[^A-Za-z0-9]/.test(data.password) ? 'bx-check' : 'bx-minus'}`}></i>
                                            Contains special characters
                                        </li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <i className="bx bx-loader-alt bx-spin"></i>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bx bx-lock-alt"></i>
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Security Tips */}
                        <div className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                🔒 Security Tips
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-start gap-3">
                                    <i className="bx bx-shield text-green-500 mt-0.5"></i>
                                    <div>
                                        <p className="font-medium">Use Strong Passwords</p>
                                        <p>Combine uppercase, lowercase, numbers, and symbols</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="bx bx-refresh text-blue-500 mt-0.5"></i>
                                    <div>
                                        <p className="font-medium">Change Regularly</p>
                                        <p>Update your password every 3-6 months</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="bx bx-lock text-purple-500 mt-0.5"></i>
                                    <div>
                                        <p className="font-medium">Keep it Unique</p>
                                        <p>Use different passwords for different accounts</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <i className="bx bx-key text-orange-500 mt-0.5"></i>
                                    <div>
                                        <p className="font-medium">Never Share</p>
                                        <p>Don't share your password with anyone</p>
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
