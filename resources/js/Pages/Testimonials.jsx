import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Testimonials({ testimonials = [] }) {
    const defaultTestimonials = testimonials.length > 0 ? testimonials : [
        {
            name: 'Sarah Wanjiku',
            position: 'Software Engineer',
            company: 'TechCorp Kenya',
            image: '/assets/img/testimonial-img.jpg',
            rating: 5,
            content: 'Kazi Sasa helped me find my dream job in tech. The platform is user-friendly and I got multiple interview calls within a week of posting my resume. The job matching algorithm is spot on!'
        },
        {
            name: 'John Mwangi',
            position: 'Marketing Manager',
            company: 'Creative Agency',
            image: '/assets/img/testimonial-img-2.jpg',
            rating: 5,
            content: 'Excellent job portal! I was able to connect with top companies and landed a great position. The application process was smooth and the platform kept me updated throughout. Highly recommend to anyone looking for career opportunities.'
        },
        {
            name: 'Grace Achieng',
            position: 'HR Director',
            company: 'Global Solutions Ltd',
            image: '/assets/img/testimonial-img-3.jpg',
            rating: 5,
            content: 'As an employer, Kazi Sasa has been instrumental in finding qualified candidates. The candidate database is extensive and the filtering tools are excellent. We\'ve made several great hires through this platform.'
        },
        {
            name: 'David Kimani',
            position: 'Business Analyst',
            company: 'Finance Corp',
            image: '/assets/img/testimonial-img-4.jpg',
            rating: 5,
            content: 'The platform made my job search so much easier. I appreciate the daily job alerts and the ability to track all my applications in one place. Found my current position within two weeks!'
        },
        {
            name: 'Mary Njeri',
            position: 'Recruitment Manager',
            company: 'Talent Solutions',
            image: '/assets/img/testimonial-img-5.jpg',
            rating: 5,
            content: 'Kazi Sasa has revolutionized our hiring process. The analytics dashboard helps us understand our recruitment metrics better, and the featured job listings get amazing visibility. Worth every penny!'
        },
        {
            name: 'Peter Ochieng',
            position: 'Data Scientist',
            company: 'Analytics Hub',
            image: '/assets/img/testimonial-img-6.jpg',
            rating: 5,
            content: 'I\'ve used several job boards, but Kazi Sasa stands out for its clean interface and relevant job recommendations. The mobile app makes it easy to apply on the go. Highly professional platform!'
        }
    ];

    const stats = [
        {
            number: '50,000+',
            label: 'Successful Hires',
            icon: 'bx-check-circle',
            color: 'blue'
        },
        {
            number: '95%',
            label: 'Satisfaction Rate',
            icon: 'bx-happy',
            color: 'green'
        },
        {
            number: '2,000+',
            label: 'Active Employers',
            icon: 'bx-buildings',
            color: 'purple'
        },
        {
            number: '4.9/5',
            label: 'Average Rating',
            icon: 'bx-star',
            color: 'yellow'
        }
    ];

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <i
                key={index}
                className={`bx ${index < rating ? 'bxs-star' : 'bx-star'} text-yellow-500`}
            ></i>
        ));
    };

    return (
        <AppLayout title="Testimonials">
            <Head>
                <meta name="description" content="Read success stories from professionals who found their dream jobs and employers who hired top talent through Kazi Sasa." />
            </Head>

            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-900 py-20 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Success Stories
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Hear from professionals and employers who have transformed their careers and businesses with Kazi Sasa.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700 shadow-lg"
                            >
                                <div className={`w-16 h-16 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <i className={`bx ${stat.icon} text-3xl text-${stat.color}-600 dark:text-${stat.color}-400`}></i>
                                </div>
                                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Grid */}
            <div className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {defaultTestimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {renderStars(testimonial.rating)}
                                </div>

                                {/* Content */}
                                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {testimonial.position}
                                        </p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">
                                            {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Video Testimonials Section */}
            <div className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Watch Success Stories
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Get inspired by real stories from our community members.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {[1, 2].map((_, index) => (
                            <div
                                key={index}
                                className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden group cursor-pointer"
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                        <i className="bx bx-play text-4xl text-blue-600 dark:text-blue-400"></i>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className="text-white font-semibold mb-1">
                                        Success Story {index + 1}
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        How Kazi Sasa changed my career
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Ready to Write Your Success Story?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of professionals who have found their dream jobs with Kazi Sasa.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-xl"
                            >
                                Get Started Today
                                <i className="bx bx-right-arrow-alt text-xl"></i>
                            </a>
                            <a
                                href="/jobs"
                                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
                            >
                                Browse Jobs
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}