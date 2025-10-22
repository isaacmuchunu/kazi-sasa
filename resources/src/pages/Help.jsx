import React from 'react';
import { Link } from 'react-router-dom';
import { QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-lg text-gray-600">Find answers to common questions or get in touch with our support team</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <QuestionMarkCircleIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpenIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-600 mb-4">Learn the basics of using Kazi Sasa to find your next job or hire great talent.</p>
            <Link to="#" className="text-indigo-600 hover:text-indigo-500 font-medium">View articles →</Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <QuestionMarkCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQs</h3>
            <p className="text-gray-600 mb-4">Find quick answers to frequently asked questions about our platform.</p>
            <Link to="#" className="text-indigo-600 hover:text-indigo-500 font-medium">View FAQs →</Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">Get personalized help from our support team.</p>
            <Link to="/contact" className="text-indigo-600 hover:text-indigo-500 font-medium">Contact us →</Link>
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="p-6 hover:bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How to create a compelling job profile</h3>
                <p className="text-gray-600 mb-2">Learn how to stand out from other candidates with a professional profile.</p>
                <Link to="#" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">Read more →</Link>
              </div>
              <div className="p-6 hover:bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tips for acing your job interview</h3>
                <p className="text-gray-600 mb-2">Professional advice to help you prepare for and succeed in interviews.</p>
                <Link to="#" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">Read more →</Link>
              </div>
              <div className="p-6 hover:bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How to write an effective job description</h3>
                <p className="text-gray-600 mb-2">Best practices for employers to attract the right candidates.</p>
                <Link to="#" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">Read more →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-indigo-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">Our support team is here to help you 24/7</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Contact Support
            </Link>
            <a href="mailto:support@kazisasa.co.ke" className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
