import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Profile({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        user_name: user.user_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        gender: user.gender || '',
        dob: user.dob || '',
        job_title: user.job_title || '',
        experience_years: user.experience_years || '',
        location: user.location || '',
        country: user.country || '',
        city: user.city || '',
        zip_code: user.zip_code || '',
        bio: user.bio || '',
        social_links: user.social_links || {},
        profile_image: null,
    });

    const [previewImage, setPreviewImage] = useState(user.profile_image || null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/account/profile');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_image', file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout>
            <Head title="Edit Profile" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Edit Profile</h1>
                        <p className="text-xl text-blue-100">
                            Update your personal information and professional details.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Profile Image */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Picture</h2>
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img
                                            src={previewImage || '/assets/img/avatar-placeholder.png'}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                                        >
                                            <i className="bx bx-camera text-lg"></i>
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                                            Upload a new profile picture. JPG, PNG or GIF. Max size 2MB.
                                        </p>
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Remove current photo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Username *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.user_name}
                                            onChange={(e) => setData('user_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.user_name && <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.phone_number}
                                            onChange={(e) => setData('phone_number', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Gender *
                                        </label>
                                        <select
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Date of Birth *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.dob}
                                            onChange={(e) => setData('dob', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            value={data.job_title}
                                            onChange={(e) => setData('job_title', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g. Software Engineer"
                                        />
                                        {errors.job_title && <p className="text-red-500 text-sm mt-1">{errors.job_title}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Years of Experience
                                        </label>
                                        <select
                                            value={data.experience_years}
                                            onChange={(e) => setData('experience_years', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select Experience</option>
                                            <option value="0">Fresh Graduate</option>
                                            <option value="1">1 Year</option>
                                            <option value="2">2 Years</option>
                                            <option value="3">3 Years</option>
                                            <option value="5">5+ Years</option>
                                            <option value="10">10+ Years</option>
                                        </select>
                                        {errors.experience_years && <p className="text-red-500 text-sm mt-1">{errors.experience_years}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g. Nairobi, Kenya"
                                        />
                                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="Kenya"
                                        />
                                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="Nairobi"
                                        />
                                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            ZIP Code
                                        </label>
                                        <input
                                            type="text"
                                            value={data.zip_code}
                                            onChange={(e) => setData('zip_code', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="00100"
                                        />
                                        {errors.zip_code && <p className="text-red-500 text-sm mt-1">{errors.zip_code}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professional Bio</h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tell us about yourself
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Write a brief description about your professional background, skills, and career goals..."
                                    />
                                    {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <i className="bx bx-loader-alt bx-spin"></i>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bx bx-save"></i>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
