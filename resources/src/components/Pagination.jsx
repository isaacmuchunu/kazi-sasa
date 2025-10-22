import React from "react";

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.last_page <= 1) {
    return null;
  }

  const { current_page: currentPage, last_page: lastPage } = meta;

  const goToPage = (page) => {
    if (page < 1 || page > lastPage || page === currentPage) {
      return;
    }
    onPageChange?.(page);
  };

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, currentPage + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return (
    <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {start > 1 && (
        <button
          type="button"
          onClick={() => goToPage(1)}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
        >
          1
        </button>
      )}
      {start > 2 && <span className="px-1 text-slate-400">&hellip;</span>}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => goToPage(page)}
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition ${
            page === currentPage
              ? "bg-indigo-600 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
          }`}
        >
          {page}
        </button>
      ))}

      {end < lastPage - 1 && <span className="px-1 text-slate-400">&hellip;</span>}
      {end < lastPage && (
        <button
          type="button"
          onClick={() => goToPage(lastPage)}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
        >
          {lastPage}
        </button>
      )}

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= lastPage}
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
