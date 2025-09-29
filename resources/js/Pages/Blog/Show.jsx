import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistanceToNow } from 'date-fns';

export default function BlogShow({ blog, relatedPosts = [] }) {
    const [activeShare, setActiveShare] = useState(null);

    const calculateReadingTime = (content) => {
        if (!content) {
            return '5 min read';
        }
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = blog.title;
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
        setActiveShare(platform);
        setTimeout(() => setActiveShare(null), 2000);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setActiveShare('copy');
        setTimeout(() => setActiveShare(null), 2000);
    };

    return (
        <AppLayout>
            <Head title={blog.title}>
                <meta name="description" content={blog.excerpt} />
                <meta property="og:title" content={blog.title} />
                <meta property="og:description" content={blog.excerpt} />
                <meta property="og:image" content={blog.featured_image} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                                Home
                            </Link>
                            <i className="bx bx-chevron-right"></i>
                            <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
                                Blog
                            </Link>
                            <i className="bx bx-chevron-right"></i>
                            <span className="text-gray-900 dark:text-white">Article</span>
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {blog.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
                            <div className="flex items-center gap-3">
                                <img
                                    src={blog.author?.profile_image || '/assets/img/avatar-placeholder.png'}
                                    alt={blog.author?.first_name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {blog.author?.first_name} {blog.author?.last_name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {blog.author?.job_title || 'Author'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="flex items-center gap-2">
                                    <i className="bx bx-calendar"></i>
                                    {new Date(blog.published_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                                <span className="flex items-center gap-2">
                                    <i className="bx bx-time"></i>
                                    {calculateReadingTime(blog.content)}
                                </span>
                                <span className="flex items-center gap-2">
                                    <i className="bx bx-show"></i>
                                    {blog.views_count || 0} views
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-white dark:bg-gray-900 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Social Share Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24">
                                    <div className="flex lg:flex-col gap-4">
                                        <button
                                            onClick={() => handleShare('facebook')}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                            title="Share on Facebook"
                                        >
                                            <i className="bx bxl-facebook"></i>
                                        </button>
                                        <button
                                            onClick={() => handleShare('twitter')}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600 text-white transition-colors"
                                            title="Share on Twitter"
                                        >
                                            <i className="bx bxl-twitter"></i>
                                        </button>
                                        <button
                                            onClick={() => handleShare('linkedin')}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 hover:bg-blue-800 text-white transition-colors"
                                            title="Share on LinkedIn"
                                        >
                                            <i className="bx bxl-linkedin"></i>
                                        </button>
                                        <button
                                            onClick={() => handleShare('whatsapp')}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                                            title="Share on WhatsApp"
                                        >
                                            <i className="bx bxl-whatsapp"></i>
                                        </button>
                                        <button
                                            onClick={copyLink}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                                            title="Copy Link"
                                        >
                                            <i className={`bx ${activeShare === 'copy' ? 'bx-check' : 'bx-link'}`}></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="lg:col-span-11">
                                {/* Featured Image */}
                                {blog.featured_image && (
                                    <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src={blog.featured_image}
                                            alt={blog.title}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    {/* Excerpt */}
                                    {blog.excerpt && (
                                        <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium border-l-4 border-blue-600 pl-6 py-2">
                                            {blog.excerpt}
                                        </p>
                                    )}

                                    {/* Main Content */}
                                    <div
                                        className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                    />
                                </div>

                                {/* Tags */}
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {blog.tags.map((tag, index) => (
                                                <Link
                                                    key={index}
                                                    href={`/blog?tag=${tag}`}
                                                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    #{tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Author Bio */}
                                <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
                                    <div className="flex items-start gap-6">
                                        <img
                                            src={blog.author?.profile_image || '/assets/img/avatar-placeholder.png'}
                                            alt={blog.author?.first_name}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                About {blog.author?.first_name} {blog.author?.last_name}
                                            </h3>
                                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                                                {blog.author?.bio || `${blog.author?.first_name} is a ${blog.author?.job_title || 'professional'} at Kazi Sasa.`}
                                            </p>
                                            {blog.author?.social_links && (
                                                <div className="flex gap-3">
                                                    {blog.author.social_links.linkedin && (
                                                        <a
                                                            href={blog.author.social_links.linkedin}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            <i className="bx bxl-linkedin text-xl"></i>
                                                        </a>
                                                    )}
                                                    {blog.author.social_links.twitter && (
                                                        <a
                                                            href={blog.author.social_links.twitter}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
                                                        >
                                                            <i className="bx bxl-twitter text-xl"></i>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Share Section */}
                                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Share this article
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => handleShare('facebook')}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            <i className="bx bxl-facebook"></i>
                                            Facebook
                                        </button>
                                        <button
                                            onClick={() => handleShare('twitter')}
                                            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            <i className="bx bxl-twitter"></i>
                                            Twitter
                                        </button>
                                        <button
                                            onClick={() => handleShare('linkedin')}
                                            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            <i className="bx bxl-linkedin"></i>
                                            LinkedIn
                                        </button>
                                        <button
                                            onClick={() => handleShare('whatsapp')}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            <i className="bx bxl-whatsapp"></i>
                                            WhatsApp
                                        </button>
                                        <button
                                            onClick={copyLink}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                                                activeShare === 'copy'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            <i className={`bx ${activeShare === 'copy' ? 'bx-check' : 'bx-link'}`}></i>
                                            {activeShare === 'copy' ? 'Copied!' : 'Copy Link'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-gray-50 dark:bg-gray-800 py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                                Related Articles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedPosts.map(post => (
                                    <article
                                        key={post.id}
                                        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        <Link href={`/blog/${post.slug}`}>
                                            <img
                                                src={post.featured_image || '/assets/img/blog-placeholder.jpg'}
                                                alt={post.title}
                                                className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                                            />
                                        </Link>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <i className="bx bx-calendar"></i>
                                                    {new Date(post.published_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <i className="bx bx-time"></i>
                                                    {calculateReadingTime(post.content)}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                                                <Link href={`/blog/${post.slug}`}>
                                                    {post.title}
                                                </Link>
                                            </h3>
                                            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={post.author?.profile_image || '/assets/img/avatar-placeholder.png'}
                                                    alt={post.author?.first_name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {post.author?.first_name} {post.author?.last_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </AppLayout>
    );
}