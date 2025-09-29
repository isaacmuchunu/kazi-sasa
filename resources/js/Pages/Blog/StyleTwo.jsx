import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function BlogStyleTwo({
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

        router.get('/blog/style-two', Object.fromEntries(params), {
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
        router.get('/blog/style-two');
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
            <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-24 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Insights & Stories
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Explore expert advice, career tips, and industry insights to accelerate your professional journey
                        </p>

                        {/* Search & Filter Bar */}
                        <div className="bg-white rounded-2xl p-6 shadow-2xl">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search articles..."
                                        value={searchFilters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    />
                                </div>
                                <select
                                    value={searchFilters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => router.get('/blog/style-two', searchFilters)}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl"
                                >
                                    <i className="bx bx-search mr-2"></i>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Post - Full Width */}
            {featured && (
                <section className="bg-white dark:bg-gray-900 py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src={featured.featured_image || '/assets/img/blog-placeholder.jpg'}
                                    alt={featured.title}
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                                    <div className="max-w-3xl">
                                        <span className="inline-block bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
                                            Featured Article
                                        </span>
                                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                                            {featured.title}
                                        </h2>
                                        <p className="text-lg text-gray-200 mb-6 line-clamp-2">
                                            {featured.excerpt}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-6 mb-6">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={featured.author?.profile_image || '/assets/img/avatar-placeholder.png'}
                                                    alt={featured.author?.first_name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                                />
                                                <div>
                                                    <p className="font-semibold">
                                                        {featured.author?.first_name} {featured.author?.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-300">
                                                        {featured.author?.job_title || 'Author'}
                                                    </p>
                                                </div>
                                            </div>
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
                                        <Link
                                            href={`/blog/${featured.slug}`}
                                            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                        >
                                            Read Full Article
                                            <i className="bx bx-right-arrow-alt text-xl"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Filter Tabs */}
            <section className="bg-gray-50 dark:bg-gray-800 py-8 sticky top-0 z-40 shadow-md">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {pagination.total || 0} Articles
                                </h3>
                                {filters.search && (
                                    <span className="text-gray-600 dark:text-gray-400">
                                        matching "{filters.search}"
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <select
                                    value={searchFilters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="latest">Latest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                                {(searchFilters.search || searchFilters.category) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="bg-white dark:bg-gray-900 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {blogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogs.map(blog => (
                                    <article
                                        key={blog.id}
                                        className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                                    >
                                        {/* Image */}
                                        <Link href={`/blog/${blog.slug}`} className="block relative overflow-hidden">
                                            <img
                                                src={blog.featured_image || '/assets/img/blog-placeholder.jpg'}
                                                alt={blog.title}
                                                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            {blog.tags && blog.tags.length > 0 && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        {blog.tags[0]}
                                                    </span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Meta Info */}
                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <i className="bx bx-calendar"></i>
                                                    {new Date(blog.published_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <i className="bx bx-time"></i>
                                                    {calculateReadingTime(blog.content)}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                <Link href={`/blog/${blog.slug}`}>
                                                    {blog.title}
                                                </Link>
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                                                {blog.excerpt}
                                            </p>

                                            {/* Author & CTA */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={blog.author?.profile_image || '/assets/img/avatar-placeholder.png'}
                                                        alt={blog.author?.first_name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {blog.author?.first_name} {blog.author?.last_name}
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            {blog.author?.job_title || 'Author'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/blog/${blog.slug}`}
                                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                                                >
                                                    Read
                                                    <i className="bx bx-right-arrow-alt text-lg"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                                    <i className="bx bx-search-alt text-5xl text-gray-400"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    No articles found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                    We couldn't find any articles matching your search. Try adjusting your filters or search terms.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="mt-16 flex justify-center">
                                <nav className="flex items-center gap-2">
                                    {pagination.prev_page_url && (
                                        <Link
                                            href={pagination.prev_page_url}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <i className="bx bx-chevron-left"></i>
                                        </Link>
                                    )}

                                    {Array.from({ length: Math.min(7, pagination.last_page) }, (_, i) => {
                                        let page;
                                        if (pagination.last_page <= 7) {
                                            page = i + 1;
                                        } else if (pagination.current_page <= 4) {
                                            page = i + 1;
                                        } else if (pagination.current_page >= pagination.last_page - 3) {
                                            page = pagination.last_page - 6 + i;
                                        } else {
                                            page = pagination.current_page - 3 + i;
                                        }

                                        return (
                                            <Link
                                                key={page}
                                                href={`/blog/style-two?page=${page}`}
                                                className={`px-4 py-2 border rounded-lg transition-colors ${
                                                    pagination.current_page === page
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
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
                                            <i className="bx bx-chevron-right"></i>
                                        </Link>
                                    )}
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Stay Updated with Career Insights
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Subscribe to our newsletter and get the latest career tips delivered to your inbox
                        </p>
                        <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50"
                            />
                            <button
                                type="submit"
                                className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
                            >
                                Subscribe Now
                            </button>
                        </form>
                        <p className="text-sm text-blue-100 mt-4">
                            Join 10,000+ professionals already subscribed
                        </p>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}