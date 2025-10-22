import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-2xl font-bold text-rose-600">
      404
    </div>
    <h1 className="text-3xl font-semibold text-slate-900">We couldn&apos;t find that page</h1>
    <p className="max-w-xl text-sm text-slate-600">
      The page you&apos;re looking for may have moved or no longer exists. Try starting from the homepage or
      browsing open roles.
    </p>
    <div className="flex flex-wrap justify-center gap-3">
      <Link
        to="/"
        className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Back to home
      </Link>
      <Link
        to="/jobs"
        className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
      >
        Browse jobs
      </Link>
    </div>
  </div>
);

export default NotFound;
