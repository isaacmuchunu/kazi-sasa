import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", exact: true },
  { to: "/jobs", label: "Jobs" },
  { to: "/companies", label: "Companies" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "text-indigo-600"
        : "text-slate-600 hover:text-indigo-500 focus-visible:text-indigo-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-indigo-600"
          onClick={closeMenu}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            KS
          </span>
          Kazi Sasa
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map(({ to, label, exact }) => (
            <NavLink key={to} to={to} end={exact} className={linkClasses}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/jobs"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Browse jobs
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          onClick={toggleMenu}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } grid overflow-hidden transition-[grid-template-rows] duration-300 md:hidden`}
      >
        <nav className="border-t border-slate-200 bg-white px-4 pb-4">
          <div className="flex flex-col gap-1 pt-3">
            {navItems.map(({ to, label, exact }) => (
              <NavLink
                key={`mobile-${to}`}
                to={to}
                end={exact}
                className={linkClasses}
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/jobs"
              className="mt-1 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={closeMenu}
            >
              Browse jobs
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
