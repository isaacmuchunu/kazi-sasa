import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../services/api";
import JobCard from "../components/JobCard";
import CompanyCard from "../components/CompanyCard";
import CategoryCard from "../components/CategoryCard";
import LoadingScreen from "../components/LoadingScreen";
import ErrorMessage from "../components/ErrorMessage";
import { StarIcon, BriefcaseIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon, BuildingOfficeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const [homepageData, setHomepageData] = useState({
    jobs: [],
    categories: [],
    companies: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchForm = {
    keywords: '',
    location: '',
    category: '',
    jobType: 'all'
  };

  const [formData, setFormData] = useState(searchForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    
    if (formData.keywords) searchParams.append('search', formData.keywords);
    if (formData.location) searchParams.append('location', formData.location);
    if (formData.category) searchParams.append('category', formData.category);
    if (formData.jobType !== 'all') searchParams.append('type', formData.jobType);
    
    window.location.href = `/jobs?${searchParams.toString()}`;
  };

  const loadHomepageData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [jobsResponse, categoriesResponse, companiesResponse] = await Promise.all([
        apiService.getJobs({ per_page: 6, featured: 1 }),
        apiService.getCategories({ per_page: 8 }),
        apiService.getCompanies({ per_page: 6 }),
      ]);

      setHomepageData({
        jobs: jobsResponse?.data?.data ?? [],
        categories: categoriesResponse?.data?.data ?? [],
        companies: companiesResponse?.data?.data ?? [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load homepage data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomepageData();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Active jobs", value: homepageData.jobs.length, highlight: true },
      { label: "Categories", value: homepageData.categories.length },
      { label: "Featured companies", value: homepageData.companies.length },
    ],
    [homepageData],
  );

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadHomepageData} />;
  }

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 px-4 py-16 md:flex-row md:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase text-indigo-700">
              Empowering Kenyan careers
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find the right job, grow with the right company.
            </h1>
            <p className="mt-4 text-base text-slate-600">
              Explore curated opportunities across Kenya&apos;s fastest growing industries. Apply once, stay
              updated, and connect directly with hiring teams.
            </p>
            
            {/* Enhanced Search Form */}
            <div className="mt-8">
              <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleInputChange}
                      placeholder="Keywords..."
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Location..."
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    />
                  </div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  >
                    <option value="">All Categories</option>
                    {homepageData.categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  >
                    <option value="all">All Types</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    Search Jobs
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/jobs"
                className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Browse open roles
              </Link>
              <Link
                to="/companies"
                className="rounded-full border border-indigo-200 px-5 py-2 text-sm font-semibold text-indigo-600 hover:border-indigo-300 hover:text-indigo-700"
              >
                Meet employers
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-md gap-4 rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Featured jobs</h2>
          <Link to="/jobs" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            See all jobs
          </Link>
        </div>
        {homepageData.jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {homepageData.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            New roles are posted daily. Check back soon!
          </p>
        )}
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Top categories</h2>
          <Link to="/jobs" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Explore jobs by category
          </Link>
        </div>
        {homepageData.categories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homepageData.categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            Categories will appear once jobs are published.
          </p>
        )}
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Employers hiring now</h2>
          <Link to="/companies" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            View all companies
          </Link>
        </div>
        {homepageData.companies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {homepageData.companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            Companies will appear here once they publish roles.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
