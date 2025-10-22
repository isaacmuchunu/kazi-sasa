import React from "react";

const EmptyState = ({ title, description, action }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
