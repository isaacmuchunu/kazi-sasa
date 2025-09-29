import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistanceToNow } from 'date-fns';

export default function BlogIndex({
    blogs = [],
    featured = null,
    categories = [],
    filters = {},
    pagination = {}
}) {
    const [searchFilters, setSearchFilters] = useState({
        search: filters.search || '',
        category: filters.category || '',
        sort: filters.sort || 'latest'
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...searchFilters, [key]: value };
        setSearchFilters(newFilters);

        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) {
                params.append(k, v);
            }
        });

        router.get('/blog', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setSearchFilters({
            search: '',
            category: '',
            sort: 'latest'
        });
        router.get('/blog');
    };

    const calculateReadingTime = (content) => {
        if (!content) {
            return '5 min read';
        }
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    };

    return (
        <AppLayout title="Blog">
            <Head>
                <meta name="description" content="Read the latest career advice, job search tips, and industry insights from Kazi Sasa blog." />
            </Head>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Insights & Tips</h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Expert advice to help you navigate your career journey
                        </p>

                        {/* Search Bar */}
                        <div className="bg-white rounded-lg p-4 shadow-lg">
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchFilters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                                <button
                                    onClick={() => router.get('/blog', searchFilters)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                                >
                                    <i className="bx bx-search mr-2"></i>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            {featured && (
                <section className="bg-white dark:bg-gray-900 py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden shadow-xl">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="relative h-64 lg:h-auto">
                                        <img
                                            src={featured.featured_image || '/assets/img/blog-placeholder.jpg'}
                                            alt={featured.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                                Featured
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                            <span className="flex items-center gap-2">
                                                <i className="bx bx-calendar"></i>
                                                {new Date(featured.published_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <i className="bx bx-time"></i>
                                                {calculateReadingTime(featured.content)}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                            {featured.title}
                                        </h2>
                                        <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">
                                            {featured.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={featured.author?.profile_image || '/assets/img/avatar-placeholder.png'}
                                                    alt={featured.author?.first_name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {featured.author?.first_name} {featured.author?.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {featured.author?.job_title || 'Author'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/blog/${featured.slug}`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                                            >
                                                Read More
                                                <i className="bx bx-right-arrow-alt"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content */}
            <section className="bg-gray-50 dark:bg-gray-900 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Sidebar */}
                            <aside className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Filter Articles
                                    </h3>

                                    {/* Categories */}
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Categories
                                        </h4>
                                        <div className="space-y-2">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value=""
                                                    checked={!searchFilters.category}
                                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                                    className="text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                    All Articles
                                                </span>
                                            </label>
                                            {categories.map(category => (
                                                <label key={category} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        value={category}
                                                        checked={searchFilters.category === category}
                                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                        {category}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sort */}
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Sort By
                                        </h4>
                                        <select
                                            value={searchFilters.sort}
                                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="latest">Latest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="popular">Most Popular</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={clearFilters}
                                        className="w-full text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </aside>

                            {/* Articles Grid */}
                            <div className="lg:col-span-3">
                                {/* Results Header */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {filters.search ? `Search results for "${filters.search}"` : 'Latest Articles'}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        {pagination.total || 0} articles found
                                    </p>
                                </div>

                                {/* Articles List */}
                                {blogs.length > 0 ? (
                                    <div className="space-y-6">
                                        {blogs.map(blog => (
                                            <article
                                                key={blog.id}
                                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="md:col-span-1">
                                                        <Link href={`/blog/${blog.slug}`}>
                                                            <img
                                                                src={blog.featured_image || '/assets/img/blog-placeholder.jpg'}
                                                                alt={blog.title}
                                                                className="w-full h-48 md:h-full object-cover hover:opacity-90 transition-opacity"
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="md:col-span-2 p-6">
                                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                            <span className="flex items-center gap-1">
                                                                <i className="bx bx-calendar"></i>
                                                                {new Date(blog.published_at).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <i className="bx bx-time"></i>
                                                                {calculateReadingTime(blog.content)}
                                                            </span>
                                                            {blog.tags && blog.tags.length > 0 && (
                                                                <span className="flex items-center gap-1">
                                                                    <i className="bx bx-tag"></i>
                                                                    {blog.tags[0]}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                            <Link href={`/blog/${blog.slug}`}>
                                                                {blog.title}
                                                            </Link>
                                                        </h3>
                                                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                                                            {blog.excerpt}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={blog.author?.profile_image || '/assets/img/avatar-placeholder.png'}
                                                                    alt={blog.author?.first_name}
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                />
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                                        {blog.author?.first_name} {blog.author?.last_name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                        {blog.author?.job_title || 'Author'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Link
                                                                href={`/blog/${blog.slug}`}
                                                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold inline-flex items-center gap-2"
                                                            >
                                                                Read More
                                                                <i className="bx bx-right-arrow-alt"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                                        <i className="bx bx-search-alt text-6xl text-gray-400 mb-4"></i>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            No articles found
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            Try adjusting your search or filters
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}

                                {/* Pagination */}
                                {pagination.last_page > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <nav className="flex items-center gap-2">
                                            {pagination.prev_page_url && (
                                                <Link
                                                    href={pagination.prev_page_url}
                                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <i className="bx bx-chevron-left"></i>
                                                    Previous
                                                </Link>
                                            )}

                                            {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <Link
                                                        key={page}
                                                        href={`/blog?page=${page}`}
                                                        className={`px-4 py-2 border rounded-lg transition-colors ${
                                                            pagination.current_page === page
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {page}
                                                    </Link>
                                                );
                                            })}

                                            {pagination.next_page_url && (
                                                <Link
                                                    href={pagination.next_page_url}
                                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    Next
                                                    <i className="bx bx-chevron-right"></i>
                                                </Link>
                                            )}
                                        </nav>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}