import React from 'react';

export default function TestimonialSection({ testimonials = [] }) {
    const defaultTestimonials = [
        {
            id: 1,
            name: 'Sarah Wanjiku',
            position: 'Software Engineer',
            company: 'TechCorp Kenya',
            image: '/assets/img/testimonial-img.jpg',
            rating: 5,
            content: 'Kazi Sasa helped me find my dream job in tech. The platform is user-friendly and I got multiple interview calls within a week of posting my resume.'
        },
        {
            id: 2,
            name: 'John Mwangi',
            position: 'Marketing Manager',
            company: 'Creative Agency',
            image: '/assets/img/testimonial-img-2.jpg',
            rating: 5,
            content: 'Excellent job portal! I was able to connect with top companies and landed a great position. Highly recommend to anyone looking for career opportunities.'
        }
    ];

    const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

    return (
        <section className="testimonial-section py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="section-title text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        What Our Users Say
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Read success stories from professionals who found their dream jobs through Kazi Sasa.
                    </p>
                </div>

                <div className="testimonials-grid grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayTestimonials.map((testimonial, index) => (
                        <div key={testimonial.id} className="testimonial-card">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                                <div className="testimonial-content mb-6">
                                    <div className="rating mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                                key={i}
                                                className={`bx bxs-star text-yellow-400 ${
                                                    i < testimonial.rating ? '' : 'opacity-30'
                                                }`}
                                            ></i>
                                        ))}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        "{testimonial.content}"
                                    </p>
                                </div>

                                <div className="testimonial-author flex items-center">
                                    <div className="author-image mr-4">
                                        <img
                                            src={testimonial.image || '/assets/img/testimonial-img.jpg'}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="author-info">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {testimonial.position} at {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}