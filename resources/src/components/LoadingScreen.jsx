import React from "react";

const LoadingScreen = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm font-medium text-slate-600">Loading...</p>
    </div>
  </div>
);

export default LoadingScreen;
