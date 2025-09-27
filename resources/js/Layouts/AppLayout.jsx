import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import HeaderNew from '@/Components/HeaderNew';
import Footer from '@/Components/Footer';
import Loader from '@/Components/Loader';

export default function AppLayout({
    children,
    title = 'Home',
    showHeader = true,
    showFooter = true,
    className = ''
}) {
    const { auth, flash } = usePage().props;
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);

        // Apply dark mode class to body
        if (savedDarkMode) {
            document.body.classList.add('dark');
        }

        // Hide loader after components mount
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());

        if (newDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''} ${className}`}>
            <Head title={title} />

            {loading && <Loader />}

            {/* Flash Messages */}
            {flash?.success && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <i className="bx bx-check-circle text-xl"></i>
                        <span>{flash.success}</span>
                        <button
                            onClick={() => window.history.replaceState({}, '', window.location.pathname)}
                            className="ml-2 text-white hover:text-gray-200"
                        >
                            <i className="bx bx-x"></i>
                        </button>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <i className="bx bx-error-circle text-xl"></i>
                        <span>{flash.error}</span>
                        <button
                            onClick={() => window.history.replaceState({}, '', window.location.pathname)}
                            className="ml-2 text-white hover:text-gray-200"
                        >
                            <i className="bx bx-x"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Toggle dark mode"
            >
                {darkMode ? (
                    <i className="bx bx-sun text-yellow-500 text-xl"></i>
                ) : (
                    <i className="bx bx-moon text-gray-700 text-xl"></i>
                )}
            </button>

            <div className="flex flex-col min-h-screen">
                {showHeader && <HeaderNew />}

                <main className="flex-grow">
                    {children}
                </main>

                {showFooter && <Footer />}
            </div>

            {/* Back to Top Button */}
            <BackToTop />
        </div>
    );
}

// Back to Top Component
function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            aria-label="Back to top"
        >
            <i className="bx bx-up-arrow-alt text-xl"></i>
        </button>
    );
}