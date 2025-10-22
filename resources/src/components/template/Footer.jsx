import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Footer - Logo and Social */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-6 lg:mb-0">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">KS</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Kazi Sasa</h3>
                <p className="text-gray-400 text-sm">Find your dream job</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Follow Us:</span>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.122 1.219-5.122s-.31-.62-.31-1.538c0-1.441.833-2.515 1.871-2.515.883 0 1.306.663 1.306 1.457 0 .887-.565 2.211-.856 3.434-.244 1.032.518 1.871 1.538 1.871 1.846 0 3.267-1.949 3.267-4.75 0-2.484-1.785-4.223-4.34-4.223-2.956 0-4.692 2.217-4.692 4.51 0 .893.344 1.852.775 2.374.085.103.097.194.072.299-.079.33-.254 1.037-.289 1.183-.046.191-.151.232-.35.14-1.301-.605-2.115-2.507-2.115-4.028 0-3.273 2.378-6.279 6.852-6.279 3.598 0 6.397 2.565 6.397 5.996 0 3.578-2.254 6.455-5.387 6.455-1.052 0-2.042-.547-2.38-1.193 0 0-.52 1.98-.646 2.467-.234.897-.866 2.021-1.289 2.705C9.525 19.858 10.591 20 11.712 20c6.62 0 11.987-5.367 11.987-11.987C23.699 3.61 18.333.029 11.713.029z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <PhoneIcon className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-400">Need help? 24/7</p>
                  <a href="tel:+254712345678" className="text-white hover:text-indigo-400 font-semibold">
                    +254 712 345 678
                  </a>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Job searching just got easy. Use Kazi Sasa to run a hiring site and earn money in the process!
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
                <MapPinIcon className="w-4 h-4" />
                <span>101 E 129th St, East Chicago, IN 46312, US</span>
              </div>

              {/* Newsletter Signup */}
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Quick Links */}
            <div>
              <h6 className="text-white font-semibold mb-4">Quick Links</h6>
              <ul className="space-y-2">
                <li>
                  <Link to="/pricing" className="text-gray-400 hover:text-white text-sm">
                    Job Packages
                  </Link>
                </li>
                <li>
                  <Link to="/employer/jobs/create" className="text-gray-400 hover:text-white text-sm">
                    Post New Job
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="text-gray-400 hover:text-white text-sm">
                    Jobs Listing
                  </Link>
                </li>
                <li>
                  <Link to="/companies" className="text-gray-400 hover:text-white text-sm">
                    Employer Listing
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Candidates */}
            <div>
              <h6 className="text-white font-semibold mb-4">For Candidates</h6>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/cv-templates" className="text-gray-400 hover:text-white text-sm">
                    CV Templates
                  </Link>
                </li>
                <li>
                  <Link to="/candidates" className="text-gray-400 hover:text-white text-sm">
                    Candidate Profiles
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white text-sm">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h6 className="text-white font-semibold mb-4">For Employers</h6>
              <ul className="space-y-2">
                <li>
                  <Link to="/employer/jobs/create" className="text-gray-400 hover:text-white text-sm">
                    Post New Job
                  </Link>
                </li>
                <li>
                  <Link to="/companies" className="text-gray-400 hover:text-white text-sm">
                    Company Profiles
                  </Link>
                </li>
                <li>
                  <Link to="/employer/dashboard" className="text-gray-400 hover:text-white text-sm">
                    Employer Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-400 hover:text-white text-sm">
                    Pricing Plans
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2025 Kazi Sasa. All Rights Reserved.
              </p>
              <div className="flex items-center space-x-2">
                <img src="/images/flag-kenya.png" alt="Kenya" className="w-5 h-4 rounded" />
                <span className="text-gray-400 text-sm">English</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
