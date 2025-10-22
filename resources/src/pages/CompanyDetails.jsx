import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import ErrorMessage from "../components/ErrorMessage";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";
import { formatLocation } from "../utils/format";

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCompany = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const [companyResponse, jobsResponse] = await Promise.all([
        apiService.getCompany(id),
        apiService.getCompanyJobs(id, { page, per_page: 6 }),
      ]);

      setCompany(companyResponse?.data ?? null);
      setJobs(jobsResponse?.data?.jobs?.data ?? []);
      setMeta(jobsResponse?.data?.jobs ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load company details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadCompany();
    }
  }, [id]);

  const handlePageChange = (page) => {
    loadCompany(page);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => loadCompany(meta?.current_page ?? 1)} />;
  }

  if (!company) {
    return <ErrorMessage message="Company not found." />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="space-y-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            {company.logo ? (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-20 w-20 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-600">
                {company.name?.slice(0, 2)?.toUpperCase() ?? "CO"}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">{company.name}</h1>
              <p className="mt-2 text-sm text-slate-600">
                {company.tagline || "Building teams that solve Africa's toughest challenges."}
              </p>
              <p className="mt-2 text-sm text-slate-500">{formatLocation(company.location)}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Open roles</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{company.jobs_count ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Website</p>
              <p className="mt-1 text-sm text-indigo-600">
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noreferrer" className="hover:underline">
                    {company.website}
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
            </div>
          </div>

          {company.description && (
            <div className="mt-6 text-sm leading-relaxed text-slate-700">
              <h2 className="text-lg font-semibold text-slate-900">About the team</h2>
              <p className="mt-2">{company.description}</p>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Open positions</h2>
            <p className="text-sm text-slate-500">
              Page {meta?.current_page ?? 1} of {meta?.last_page ?? 1}
            </p>
          </div>

          {jobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
              This company hasn&apos;t published any roles yet. Check back soon!
            </div>
          )}

          <Pagination meta={meta} onPageChange={handlePageChange} />
        </section>
      </div>
    </div>
  );
};

export default CompanyDetails;
