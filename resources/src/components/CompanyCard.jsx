import React from "react";
import { Link } from "react-router-dom";
import { formatLocation } from "../utils/format";

const CompanyCard = ({ company }) => (
  <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 text-sm shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
    <div className="flex items-center gap-4">
      {company.logo ? (
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          className="h-14 w-14 rounded-full object-cover ring-1 ring-slate-200"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-base font-semibold text-indigo-600">
          {company.name?.slice(0, 2)?.toUpperCase() ?? "CO"}
        </div>
      )}
      <div>
        <Link
          to={`/companies/${company.id}`}
          className="text-base font-semibold text-slate-900 hover:text-indigo-600"
        >
          {company.name}
        </Link>
        <p className="text-slate-500">{formatLocation(company.location)}</p>
      </div>
    </div>

    <p className="mt-4 text-sm text-slate-600">
      {company.tagline || "Build your career with a team that cares about growth."}
    </p>

    <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
      <p>
        <span className="font-semibold text-slate-900">{company.jobs_count ?? 0}</span> open roles
      </p>
      <Link
        to={`/companies/${company.id}`}
        className="font-semibold text-indigo-600 hover:text-indigo-500"
      >
        View profile
      </Link>
    </div>
  </article>
);

export default CompanyCard;
