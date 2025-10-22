import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, UsersIcon, GlobeAltIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Kazi Sasa</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting talented professionals with great companies across Kenya.
            We're building the future of work, one connection at a time.
          </p>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">5K+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">50K+</div>
              <div className="text-gray-600">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At Kazi Sasa, we believe that finding the right job should be simple, transparent, and rewarding.
              We're committed to creating a platform that serves both job seekers and employers with equal dedication.
            </p>
            <p className="text-gray-600 mb-6">
              Our mission is to democratize access to opportunities, making it easier for talented individuals
              to connect with companies that value their skills and potential.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span>Transparent hiring process</span>
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span>Equal opportunity for all</span>
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span>Support for career growth</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-8">
            <div className="text-center">
              <LightBulbIcon className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation at Heart</h3>
              <p className="text-gray-600">
                We leverage cutting-edge technology to create meaningful connections between
                talent and opportunity, making the job search process more efficient and effective for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">
                We build lasting relationships with our users and prioritize their success above all else.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Impact</h3>
              <p className="text-gray-600">
                We believe in creating opportunities that transcend borders and connect talent worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We maintain the highest standards in everything we do, from user experience to customer support.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're a diverse team of passionate individuals dedicated to revolutionizing the job market in Kenya and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'CEO & Founder',
                bio: 'Former HR director with 10+ years experience in talent acquisition.',
                image: '/images/team/sarah.jpg'
              },
              {
                name: 'Michael Chen',
                role: 'CTO',
                bio: 'Tech entrepreneur passionate about building scalable platforms.',
                image: '/images/team/michael.jpg'
              },
              {
                name: 'Grace Wanjiku',
                role: 'Head of Community',
                bio: 'Community builder focused on empowering Kenyan talent.',
                image: '/images/team/grace.jpg'
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                <p className="text-indigo-600 mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Mission?</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Whether you're looking for your next opportunity or seeking great talent,
            we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
