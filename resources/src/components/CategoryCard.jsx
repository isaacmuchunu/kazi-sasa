import React from "react";

const CategoryCard = ({ category }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
    <p className="text-base font-semibold text-slate-900">{category.name}</p>
    <p className="mt-2 text-slate-500">{category.jobs_count ?? 0} open roles</p>
  </div>
);

export default CategoryCard;
