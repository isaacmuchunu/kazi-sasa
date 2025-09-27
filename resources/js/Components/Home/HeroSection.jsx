import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function HeroSection() {
    const [searchData, setSearchData] = useState({
        keyword: '',
        location: '',
        category: ''
    });

    const handleInputChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const searchParams = new URLSearchParams();
        if (searchData.keyword) searchParams.append('search', searchData.keyword);
        if (searchData.location) searchParams.append('location', searchData.location);
        if (searchData.category) searchParams.append('category', searchData.category);

        router.get(`/jobs?${searchParams.toString()}`);
    };

    const trendingKeywords = [
        'Technology',
        'Marketing',
        'Finance',
        'Healthcare',
        'Education'
    ];

    return (
        <div className="banner-section relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-gray-900">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                <div className="absolute top-1/2 -left-20 w-32 h-32 bg-yellow-400 opacity-10 rounded-full"></div>
                <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-green-400 opacity-10 rounded-full"></div>

                {/* Floating shapes */}
                <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-white opacity-20 rotate-45"></div>
                <div className="absolute top-3/4 right-1/3 w-4 h-4 bg-yellow-400 opacity-30 rotate-12"></div>
                <div className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-green-400 opacity-20 rounded-full"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center text-white">
                    {/* Hero Content */}
                    <div className="hero-content mb-12">
                        <p className="text-lg md:text-xl mb-4 text-blue-100 animate-fade-in-up animation-delay-200">
                            Find Jobs, Employment & Career Opportunities
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight animate-fade-in-up animation-delay-400">
                            Drop Resume & Get Your
                            <span className="block text-yellow-400">Desire Job!</span>
                        </h1>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="banner-form max-w-4xl mx-auto mb-8 animate-fade-in-up animation-delay-600">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Keyword Input */}
                                <div className="form-group">
                                    <label htmlFor="keyword" className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <i className="bx bx-search mr-2"></i>
                                        Keyword:
                                    </label>
                                    <input
                                        type="text"
                                        id="keyword"
                                        name="keyword"
                                        value={searchData.keyword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        placeholder="Job Title, Skills, or Company"
                                    />
                                </div>

                                {/* Location Input */}
                                <div className="form-group">
                                    <label htmlFor="location" className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <i className="bx bx-map mr-2"></i>
                                        Location:
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={searchData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        placeholder="City, County, or Remote"
                                    />
                                </div>

                                {/* Search Button */}
                                <div className="form-group flex items-end">
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        <i className="bx bx-search mr-2"></i>
                                        Find A Job
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Trending Keywords */}
                    <div className="trending-keywords animate-fade-in-up animation-delay-800">
                        <div className="flex flex-wrap items-center justify-center gap-2 text-blue-100">
                            <span className="font-medium">Trending Keywords:</span>
                            {trendingKeywords.map((keyword, index) => (
                                <span key={index} className="flex items-center">
                                    <button
                                        onClick={() => setSearchData({ ...searchData, keyword })}
                                        className="hover:text-yellow-400 transition-colors duration-200 hover:underline"
                                    >
                                        {keyword}
                                    </button>
                                    {index < trendingKeywords.length - 1 && (
                                        <span className="mx-1">,</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="quick-stats grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-fade-in-up animation-delay-1000">
                        <div className="stat-item">
                            <div className="text-2xl md:text-3xl font-bold text-yellow-400">5K+</div>
                            <div className="text-sm text-blue-100">Jobs Posted</div>
                        </div>
                        <div className="stat-item">
                            <div className="text-2xl md:text-3xl font-bold text-yellow-400">2K+</div>
                            <div className="text-sm text-blue-100">Companies</div>
                        </div>
                        <div className="stat-item">
                            <div className="text-2xl md:text-3xl font-bold text-yellow-400">10K+</div>
                            <div className="text-sm text-blue-100">Candidates</div>
                        </div>
                        <div className="stat-item">
                            <div className="text-2xl md:text-3xl font-bold text-yellow-400">95%</div>
                            <div className="text-sm text-blue-100">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
                <div className="flex flex-col items-center">
                    <span className="text-sm mb-2">Scroll Down</span>
                    <i className="bx bx-down-arrow-alt text-2xl"></i>
                </div>
            </div>
        </div>
    );
}