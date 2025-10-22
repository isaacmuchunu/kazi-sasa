import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiService from "../services/api";
import JobCard from "../components/JobCard";
import LoadingScreen from "../components/LoadingScreen";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";

const jobTypes = [
  { label: "Any type", value: "" },
  { label: "Full time", value: "full_time" },
  { label: "Part time", value: "part_time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      location: searchParams.get("location") ?? "",
      type: searchParams.get("type") ?? "",
      page: Number(searchParams.get("page") ?? 1),
    }),
    [searchParams],
  );

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getJobs({
        search: filters.search || undefined,
        location: filters.location || undefined,
        type: filters.type || undefined,
        page: filters.page,
        per_page: 10,
      });

      setJobs(response?.data?.data ?? []);
      setMeta(response?.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextParams = new URLSearchParams();

    ["search", "location", "type"].forEach((key) => {
      const value = formData.get(key)?.toString().trim();
      if (value) {
        nextParams.set(key, value);
      }
    });

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handlePageChange = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", page.toString());
    setSearchParams(nextParams);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchJobs} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            Keyword
            <input
              name="search"
              defaultValue={filters.search}
              placeholder="e.g. product designer"
              className="mt-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-slate-700">
            Location
            <input
              name="location"
              defaultValue={filters.location}
              placeholder="Nairobi, Mombasa..."
              className="mt-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-slate-700">
            Job type
            <select
              name="type"
              defaultValue={filters.type}
              className="mt-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {jobTypes.map((type) => (
                <option key={type.value || "any"} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Search jobs
            </button>
          </div>
        </form>
      </div>

      <section className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Open opportunities</h1>
          <p className="text-sm text-slate-500">
            Showing page {meta?.current_page ?? 1} of {meta?.last_page ?? 1}
          </p>
        </div>

        {jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No jobs match your filters yet"
            description="Try adjusting keywords or broadening the location to discover more roles."
            action={
              <button
                type="button"
                onClick={() => setSearchParams(new URLSearchParams())}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
              >
                Reset filters
              </button>
            }
          />
        )}

        <Pagination meta={meta} onPageChange={handlePageChange} />
      </section>
    </div>
  );
};

export default Jobs;
