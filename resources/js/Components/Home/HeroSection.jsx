import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function HeroSection() {
    const [searchData, setSearchData] = useState({
        keyword: '',
        location: ''
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
        <div className="relative bg-white dark:bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column - Text Content */}
                    <div className="text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                            Find your dream job
                            <span className="block text-blue-600 dark:text-blue-400 mt-2">with confidence</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl">
                            Connect with leading companies and discover opportunities that match your skills and ambitions.
                        </p>

                        {/* Search Form - Single Line */}
                        <form onSubmit={handleSearch} className="mb-8">
                            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                                {/* Keyword Input */}
                                <div className="flex-1 flex items-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
                                    <i className="bx bx-search text-gray-400 text-xl mr-3"></i>
                                    <input
                                        type="text"
                                        name="keyword"
                                        value={searchData.keyword}
                                        onChange={handleInputChange}
                                        className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="Job title or keyword"
                                    />
                                </div>

                                {/* Location Input */}
                                <div className="flex-1 flex items-center px-4 py-2">
                                    <i className="bx bx-map text-gray-400 text-xl mr-3"></i>
                                    <input
                                        type="text"
                                        name="location"
                                        value={searchData.location}
                                        onChange={handleInputChange}
                                        className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="City or remote"
                                    />
                                </div>

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Trending Keywords as Pills */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Trending:</span>
                            {trendingKeywords.map((keyword, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSearchData({ ...searchData, keyword })}
                                    className="text-sm px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    {keyword}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Stats Visual */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Stat Cards */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">5K+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Active Jobs</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800 mt-8">
                                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">2K+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Companies</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 border border-green-200 dark:border-green-800 -mt-8">
                                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">10K+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Candidates</div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-8 border border-orange-200 dark:border-orange-800">
                                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">95%</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Success Rate</div>
                            </div>
                        </div>

                        {/* Subtle decorative element */}
                        <div className="absolute -z-10 -top-4 -right-4 w-72 h-72 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
