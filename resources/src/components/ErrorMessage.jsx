import React from "react";

const ErrorMessage = ({ message, onRetry }) => (
  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
    <p className="font-medium">{message || "Something went wrong while loading data."}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
      >
        Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
