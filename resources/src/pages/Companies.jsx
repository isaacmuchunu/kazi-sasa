import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiService from "../services/api";
import CompanyCard from "../components/CompanyCard";
import LoadingScreen from "../components/LoadingScreen";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      page: Number(searchParams.get("page") ?? 1),
    }),
    [searchParams],
  );

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getCompanies({
        search: filters.search || undefined,
        page: filters.page,
        per_page: 8,
      });

      setCompanies(response?.data?.data ?? []);
      setMeta(response?.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load companies.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextParams = new URLSearchParams();

    const search = formData.get("search")?.toString().trim();
    if (search) {
      nextParams.set("search", search);
    }
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
    return <ErrorMessage message={error} onRetry={fetchCompanies} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <input
            name="search"
            defaultValue={filters.search}
            placeholder="Search companies by name"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchParams(new URLSearchParams())}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <section className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Featured employers</h1>
          <p className="text-sm text-slate-500">
            Page {meta?.current_page ?? 1} of {meta?.last_page ?? 1}
          </p>
        </div>

        {companies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No companies match your search"
            description="Try another keyword or browse without filters to discover more organisations."
          />
        )}

        <Pagination meta={meta} onPageChange={handlePageChange} />
      </section>
    </div>
  );
};

export default Companies;
