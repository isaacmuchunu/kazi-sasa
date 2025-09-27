import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import HeroSection from '@/Components/Home/HeroSection';
import CategorySection from '@/Components/Home/CategorySection';
import FeaturedJobsSection from '@/Components/Home/FeaturedJobsSection';
import HowItWorksSection from '@/Components/Home/HowItWorksSection';
import CompanySection from '@/Components/Home/CompanySection';
import TestimonialSection from '@/Components/Home/TestimonialSection';
import BlogSection from '@/Components/Home/BlogSection';
import StatsSection from '@/Components/Home/StatsSection';

export default function Home({
    auth,
    featuredJobs = [],
    categories = [],
    companies = [],
    testimonials = [],
    latestBlogs = [],
    stats = {
        totalJobs: 0,
        totalCompanies: 0,
        totalCandidates: 0,
        successRate: 0
    }
}) {
    return (
        <AppLayout title="Find Your Dream Job">
            <Head>
                <meta name="description" content="Find your dream job in Kenya with Kazi Sasa. Browse thousands of job opportunities from top companies across various industries." />
                <meta name="keywords" content="jobs, career, employment, Kenya, opportunities, hiring" />
            </Head>

            {/* Hero Section */}
            <HeroSection />

            {/* Category Section */}
            <CategorySection categories={categories} />

            {/* Featured Jobs Section */}
            <FeaturedJobsSection jobs={featuredJobs} />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Stats Section */}
            <StatsSection stats={stats} />

            {/* Top Companies Section */}
            <CompanySection companies={companies} />

            {/* Testimonials Section */}
            <TestimonialSection testimonials={testimonials} />

            {/* Latest Blog Posts */}
            <BlogSection blogs={latestBlogs} />
        </AppLayout>
    );
}