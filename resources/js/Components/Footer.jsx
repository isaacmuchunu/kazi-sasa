import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const jobCategories = [
        { name: 'Technology', count: 150, href: '/jobs?category=technology' },
        { name: 'Marketing', count: 89, href: '/jobs?category=marketing' },
        { name: 'Finance', count: 76, href: '/jobs?category=finance' },
        { name: 'Healthcare', count: 92, href: '/jobs?category=healthcare' },
        { name: 'Education', count: 64, href: '/jobs?category=education' },
        { name: 'Sales', count: 108, href: '/jobs?category=sales' }
    ];

    const quickLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms & Conditions', href: '/terms-conditions' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Pricing', href: '/pricing' }
    ];

    const socialLinks = [
        { name: 'Facebook', icon: 'bxl-facebook', href: '#', color: 'hover:text-blue-600' },
        { name: 'Twitter', icon: 'bxl-twitter', href: '#', color: 'hover:text-blue-400' },
        { name: 'LinkedIn', icon: 'bxl-linkedin', href: '#', color: 'hover:text-blue-800' },
        { name: 'Instagram', icon: 'bxl-instagram', href: '#', color: 'hover:text-pink-600' },
        { name: 'YouTube', icon: 'bxl-youtube', href: '#', color: 'hover:text-red-600' }
    ];

    return (
        <footer className="footer-section bg-gray-900 dark:bg-gray-950 text-white">
            {/* Newsletter Section */}
            <div className="newsletter-section bg-blue-600 dark:bg-blue-700 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="newsletter-content mb-8">
                            <h2 className="text-3xl font-bold mb-4">
                                Stay Updated with Latest Job Opportunities
                            </h2>
                            <p className="text-blue-100 text-lg">
                                Subscribe to our newsletter and get notified about new jobs that match your skills and interests.
                            </p>
                        </div>

                        <NewsletterForm />
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="main-footer py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="footer-widget">
                            <div className="footer-logo mb-6">
                                <Link href="/">
                                    <img
                                        src="/assets/img/logo.png"
                                        alt="Kazi Sasa"
                                        className="h-12 w-auto filter brightness-0 invert"
                                    />
                                </Link>
                            </div>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Kazi Sasa is the leading job portal in Kenya, connecting talented professionals
                                with top employers. Find your dream job or hire the best talent for your company.
                            </p>
                            <div className="social-links">
                                <p className="text-sm font-medium mb-3">Follow Us:</p>
                                <div className="flex gap-3">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            className={`social-link w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 ${social.color}`}
                                            aria-label={social.name}
                                        >
                                            <i className={`bx ${social.icon} text-lg`}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Job Categories */}
                        <div className="footer-widget">
                            <h3 className="footer-widget-title text-xl font-semibold mb-6">
                                Popular Categories
                            </h3>
                            <ul className="footer-links space-y-3">
                                {jobCategories.map((category, index) => (
                                    <li key={index}>
                                        <Link
                                            href={category.href}
                                            className="footer-link flex items-center justify-between group"
                                        >
                                            <span className="text-gray-400 group-hover:text-white transition-colors">
                                                {category.name}
                                            </span>
                                            <span className="text-sm text-gray-500 bg-gray-800 px-2 py-1 rounded">
                                                {category.count}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-widget">
                            <h3 className="footer-widget-title text-xl font-semibold mb-6">
                                Quick Links
                            </h3>
                            <ul className="footer-links space-y-3">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="footer-link text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-widget">
                            <h3 className="footer-widget-title text-xl font-semibold mb-6">
                                Contact Info
                            </h3>
                            <div className="contact-info space-y-4">
                                <div className="contact-item flex items-start gap-3">
                                    <i className="bx bx-map text-blue-500 text-xl mt-1"></i>
                                    <div>
                                        <p className="text-gray-400">
                                            123 Business Street,<br />
                                            Nairobi, Kenya
                                        </p>
                                    </div>
                                </div>
                                <div className="contact-item flex items-center gap-3">
                                    <i className="bx bx-phone text-blue-500 text-xl"></i>
                                    <a
                                        href="tel:+254700000000"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        +254 700 000 000
                                    </a>
                                </div>
                                <div className="contact-item flex items-center gap-3">
                                    <i className="bx bx-envelope text-blue-500 text-xl"></i>
                                    <a
                                        href="mailto:info@kazisasa.com"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        info@kazisasa.com
                                    </a>
                                </div>
                                <div className="contact-item flex items-start gap-3">
                                    <i className="bx bx-time text-blue-500 text-xl mt-1"></i>
                                    <div>
                                        <p className="text-gray-400">
                                            Mon - Fri: 8:00 AM - 6:00 PM<br />
                                            Saturday: 9:00 AM - 4:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom bg-gray-950 dark:bg-black py-6 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="copyright text-gray-400 text-sm">
                            © {currentYear} Kazi Sasa. All rights reserved.
                        </div>
                        <div className="footer-bottom-links flex flex-wrap gap-6 text-sm">
                            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-conditions" className="text-gray-400 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                                Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Newsletter Form Component
function NewsletterForm() {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setStatus({ type: 'error', message: 'Please enter your email address' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: 'Successfully subscribed to newsletter!' });
                setEmail('');
            } else {
                setStatus({ type: 'error', message: result.message || 'Something went wrong' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }

        // Clear status after 5 seconds
        setTimeout(() => {
            setStatus({ type: '', message: '' });
        }, 5000);
    };

    return (
        <form onSubmit={handleSubmit} className="newsletter-form max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSubmitting}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <i className="bx bx-loader-alt animate-spin mr-2"></i>
                            Subscribing...
                        </>
                    ) : (
                        <>
                            <i className="bx bx-send mr-2"></i>
                            Subscribe
                        </>
                    )}
                </button>
            </div>

            {status.message && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                    status.type === 'success'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                    {status.message}
                </div>
            )}
        </form>
    );
}