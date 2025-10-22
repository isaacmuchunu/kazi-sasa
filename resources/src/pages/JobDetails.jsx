import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiService from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import ErrorMessage from "../components/ErrorMessage";
import JobCard from "../components/JobCard";
import {
  formatRelativeTime,
  formatSalaryRange,
  formatJobType,
  formatLocation,
} from "../utils/format";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJob = async () => {
    setLoading(true);
    setError(null);

    try {
      const jobResponse = await apiService.getJob(id);
      const jobData = jobResponse?.data;
      setJob(jobData);

      const relatedResponse = await apiService.getRelatedJobs(id);
      setRelatedJobs(relatedResponse?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/jobs", { replace: true });
      return;
    }

    loadJob();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadJob} />;
  }

  if (!job) {
    return (
      <ErrorMessage
        message="We could not find that job listing."
        onRetry={() => navigate("/jobs")}
      />
    );
  }

  const company = job.company ?? {};
  const category = job.category ?? {};

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <article className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                {formatJobType(job.job_type)}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{job.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span>{company.name ?? "Anonymous company"}</span>
                <span className="inline-flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  {formatLocation(job.location)}
                </span>
                {category.name && <span>Category: {category.name}</span>}
              </div>
            </div>
            {company.logo && (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-16 w-16 rounded-full object-cover ring-1 ring-slate-200"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              {formatSalaryRange(job)}
            </span>
            {job.is_featured && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Featured role
              </span>
            )}
            {job.is_urgent && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                Urgent
              </span>
            )}
            {job.skills_required?.slice(0, 5).map((skill) => (
              <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {skill}
              </span>
            ))}
          </div>

          <section className="space-y-4 text-sm leading-relaxed text-slate-700">
            <h2 className="text-lg font-semibold text-slate-900">Role overview</h2>
            {job.description ? (
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            ) : (
              <p>Details coming soon.</p>
            )}
          </section>

          <section className="space-y-4 text-sm text-slate-700">
            <h2 className="text-lg font-semibold text-slate-900">Additional details</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Posted
                </p>
                <p className="mt-1 text-sm text-slate-900">
                  {formatRelativeTime(job.created_at) ?? "Recently"}
                </p>
              </li>
              <li className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Experience</p>
                <p className="mt-1 text-sm text-slate-900">
                  {job.experience_level ? job.experience_level.replace(/_/g, " ") : "Not specified"}
                </p>
              </li>
              <li className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applications</p>
                <p className="mt-1 text-sm text-slate-900">{job.applications_count ?? 0}</p>
              </li>
              <li className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deadline</p>
                <p className="mt-1 text-sm text-slate-900">
                  {job.apply_deadline ? new Date(job.apply_deadline).toLocaleDateString() : "Not provided"}
                </p>
              </li>
            </ul>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Apply now
            </button>
            {company.id && (
              <Link
                to={`/companies/${company.id}`}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                View company profile
              </Link>
            )}
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">About the company</h2>
            <p className="mt-3 text-sm text-slate-600">
              {company.description ||
                "This employer is eager to hire top talent. Explore their profile to learn more about their mission and open roles."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Related roles</h2>
            <div className="mt-4 space-y-4">
              {relatedJobs.length > 0 ? (
                relatedJobs.slice(0, 4).map((related) => <JobCard key={related.id} job={related} />)
              ) : (
                <p className="text-sm text-slate-600">No similar jobs available right now.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetails;
