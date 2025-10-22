import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockBlog = {
      id: 1,
      slug: slug,
      title: "How to Find Your Dream Job in Kenya",
      author: "Jane Smith",
      publishDate: "October 20, 2025",
      readTime: "5 min read",
      category: "Career Advice",
      image: "https://picsum.photos/seed/blog1/800/400.jpg",
      content: `Finding your dream job can be challenging, but with the right approach and mindset, you can make it happen. Here are some key strategies to help you navigate the competitive job market in Kenya.

## 1. Identify Your Strengths and Passions

Before you start applying for jobs, take time to understand what you're good at and what you enjoy doing. This self-awareness will help you target positions that are a good fit for your skills and interests.

## 2. Build a Strong Professional Network

Networking is crucial in today's job market. Attend industry events, connect with professionals on LinkedIn, and don't be afraid to reach out to people in roles you aspire to.

## 3. Create an Outstanding Resume

Your resume is often the first impression you make on potential employers. Make sure it highlights your achievements, skills, and experiences effectively.

## 4. Prepare for Interviews

Research the company and practice common interview questions. Being well-prepared will help you feel more confident and make a better impression.

## 5. Stay Persistent

Job searching can be a long process, but don't give up. Keep refining your approach and learning from each experience.`,
      relatedPosts: [
        { id: 2, title: "Top 10 Skills Employers Look For", slug: "top-10-skills-employers-look-for" },
        { id: 3, title: "Writing a Cover Letter That Gets Noticed", slug: "writing-cover-letter" },
        { id: 4, title: "Navigating Remote Work Opportunities", slug: "remote-work-opportunities" }
      ]
    };

    setTimeout(() => {
      setBlog(mockBlog);
      setLoading(false);
    }, 1000);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Blog post not found</h1>
          <p className="text-gray-600 mt-2">The blog post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="text-center mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {blog.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center text-gray-600 text-sm">
            <span>By {blog.author}</span>
            <span className="mx-2">•</span>
            <span>{blog.publishDate}</span>
            <span className="mx-2">•</span>
            <span>{blog.readTime}</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
        </div>

        {/* Author Bio */}
        <div className="border-t pt-8 mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl font-bold">
              {blog.author.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">About the Author</h3>
              <p className="text-gray-600">
                {blog.author} is a career coach and HR expert with over 10 years of experience in helping professionals find their dream jobs.
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Related Posts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {blog.relatedPosts.map((post) => (
              <article key={post.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Read more</span>
                    <span className="text-blue-500">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetails;
