import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDownIcon, BellIcon, UserIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { UserIcon as UserSolidIcon } from '@heroicons/react/24/solid';

const Header = ({ handleMobile }) => {
  const { user, logout, isCandidate, isEmployer } = useAuth();
  const [scroll, setScroll] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [scroll]);

  const handleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleLogout = () => {
    logout();
    setActiveDropdown(null);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
      scroll ? 'shadow-lg' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">KS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Kazi Sasa</span>
            </Link>
          </div>

          {/* Categories Dropdown */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative">
              <button
                onClick={() => handleDropdown(1)}
                className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <span>Categories</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {activeDropdown === 1 && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                      <h6 className="text-sm font-semibold text-gray-900 mb-2">Top Categories</h6>
                      <ul className="space-y-1">
                        <li>
                          <Link to="/jobs?category=design" className="text-sm text-gray-600 hover:text-indigo-600 block py-1">
                            Design & Creative
                          </Link>
                        </li>
                        <li>
                          <Link to="/jobs?category=marketing" className="text-sm text-gray-600 hover:text-indigo-600 block py-1">
                            Digital Marketing
                          </Link>
                        </li>
                        <li>
                          <Link to="/jobs?category=development" className="text-sm text-gray-600 hover:text-indigo-600 block py-1">
                            Development & IT
                          </Link>
                        </li>
                        <li>
                          <Link to="/jobs?category=music" className="text-sm text-gray-600 hover:text-indigo-600 block py-1">
                            Music & Audio
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-semibold text-gray-900 mb-2">Top Skills</h6>
                      <ul className="space-y-1">
                        <li>
                          <Link to="/jobs?skill=photoshop" className="text-sm text-gray-600 hover:text-indigo-600 block py-1">
                            Adobe Photoshop
                          </Link>
                        </li>
                        <li>
                          <Link to="/jobs?skill=figma" className="text-sm text-gray-600 hover:text-indigo-600 block py-1">
                            Figma
                          </Link>
                        </li>
                        <li>
                          <Link to="/jobs?skill=react" className="text-sm text-gray-600 hover:text-indigo-600 block py-1">
                            React
                          </Link>
                        </li>
                        <li>
                          <Link to="/jobs?skill=laravel" className="text-sm text-gray-600 hover:text-indigo-600 block py-1">
                            Laravel
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  <span>Home</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Home
                  </Link>
                </div>
              </div>

              <Link to="/jobs" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Find Jobs
              </Link>

              <Link to="/companies" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Companies
              </Link>

              <Link to="/candidates" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Candidates
              </Link>

              <Link to="/blog" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Blog
              </Link>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Help Link */}
            <Link to="/help" className="hidden lg:flex items-center text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-500 hover:text-gray-700 relative"
                >
                  <BellIcon className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h6 className="text-sm font-semibold text-gray-900">Notifications</h6>
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">5 New</span>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-2 hover:bg-gray-50">
                        <div className="text-xs text-gray-500">Last day</div>
                        <div className="text-sm text-gray-900 mt-1">
                          Your job application for <span className="font-medium">Graphic Design</span> was <span className="text-green-600">accepted</span>
                        </div>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50">
                        <div className="text-xs text-gray-500">2 days ago</div>
                        <div className="text-sm text-gray-900 mt-1">
                          New message from <span className="font-medium">TechCorp</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <Link to="/notifications" className="text-sm text-indigo-600 hover:text-indigo-500">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => handleDropdown(2)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.first_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserSolidIcon className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{user.first_name}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {activeDropdown === 2 && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setActiveDropdown(null)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setActiveDropdown(null)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setActiveDropdown(null)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={handleMobile}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
        handleMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={handleMobile} />

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        handleMobile ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">KS</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Kazi Sasa</span>
            </div>
            <button onClick={handleMobile} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            <Link to="/" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md">
              Home
            </Link>
            <Link to="/jobs" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md">
              Find Jobs
            </Link>
            <Link to="/companies" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md">
              Companies
            </Link>
            <Link to="/candidates" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md">
              Candidates
            </Link>
            <Link to="/blog" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md">
              Blog
            </Link>

            {user ? (
              <>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link to="/dashboard" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-md"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </header>
  );
};

export default Header;
