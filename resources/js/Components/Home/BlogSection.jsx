import React from 'react';
import { Link } from '@inertiajs/react';

export default function BlogSection({ blogs = [] }) {
    const defaultBlogs = [
        {
            id: 1,
            title: '10 Tips for a Successful Job Interview',
            slug: '10-tips-successful-job-interview',
            excerpt: 'Master the art of job interviews with these proven strategies that will help you stand out from other candidates.',
            image: '/assets/img/blog/1.jpg',
            author: { name: 'Career Expert' },
            published_at: '2024-01-15',
            reading_time: '5 min read',
            category: 'Career Tips'
        },
        {
            id: 2,
            title: 'How to Write a Compelling Resume',
            slug: 'how-to-write-compelling-resume',
            excerpt: 'Learn how to create a resume that catches the attention of hiring managers and lands you more interviews.',
            image: '/assets/img/blog/2.jpg',
            author: { name: 'HR Specialist' },
            published_at: '2024-01-12',
            reading_time: '7 min read',
            category: 'Resume Tips'
        },
        {
            id: 3,
            title: 'Remote Work: The Future of Employment',
            slug: 'remote-work-future-employment',
            excerpt: 'Explore the growing trend of remote work and how it\'s reshaping the job market in Kenya and beyond.',
            image: '/assets/img/blog/3.jpg',
            author: { name: 'Industry Analyst' },
            published_at: '2024-01-10',
            reading_time: '6 min read',
            category: 'Industry Trends'
        }
    ];

    const displayBlogs = blogs.length > 0 ? blogs : defaultBlogs;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <section className="blog-section py-16 lg:py-24 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="section-title text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Latest Career Insights
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Stay updated with the latest career advice, industry trends, and job search tips from our experts.
                    </p>
                </div>

                <div className="blogs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {displayBlogs.map((blog, index) => (
                        <article key={blog.id} className="blog-card group">
                            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                                {/* Blog Image */}
                                <div className="blog-image relative overflow-hidden">
                                    <img
                                        src={blog.image || '/assets/img/blog/default.jpg'}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = '/assets/img/blog/default.jpg';
                                        }}
                                    />
                                    <div className="blog-category absolute top-4 left-4">
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                            {blog.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Blog Content */}
                                <div className="blog-content p-6">
                                    {/* Blog Meta */}
                                    <div className="blog-meta flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        <span className="flex items-center">
                                            <i className="bx bx-user mr-1"></i>
                                            {blog.author.name}
                                        </span>
                                        <span className="flex items-center">
                                            <i className="bx bx-time mr-1"></i>
                                            {blog.reading_time}
                                        </span>
                                    </div>

                                    {/* Blog Title */}
                                    <h3 className="blog-title text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        <Link href={`/blog/${blog.slug}`}>
                                            {blog.title}
                                        </Link>
                                    </h3>

                                    {/* Blog Excerpt */}
                                    <p className="blog-excerpt text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                        {blog.excerpt}
                                    </p>

                                    {/* Blog Footer */}
                                    <div className="blog-footer flex items-center justify-between">
                                        <span className="blog-date text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(blog.published_at)}
                                        </span>
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="read-more text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors group-hover:underline"
                                        >
                                            Read More
                                            <i className="bx bx-right-arrow-alt ml-1"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* View All Blogs Button */}
                <div className="text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        View All Articles
                        <i className="bx bx-right-arrow-alt ml-2 text-xl"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}