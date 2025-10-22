import { formatDistanceToNow } from "date-fns";

export const formatRelativeTime = (value) => {
  if (!value) {
    return null;
  }

  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch (error) {
    console.error("Failed to format date", error);
    return null;
  }
};

export const formatSalaryRange = ({ salary_min, salary_max, salary_period }) => {
  const hasMin = typeof salary_min === "number" || salary_min;
  const hasMax = typeof salary_max === "number" || salary_max;

  if (!hasMin && !hasMax) {
    return "Salary not disclosed";
  }

  const formatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  });

  const periodLabel = salary_period ? salary_period.replace(/_/g, " ") : "month";

  if (hasMin && hasMax) {
    return `${formatter.format(salary_min || 0)} - ${formatter.format(
      salary_max || 0,
    )} / ${periodLabel}`;
  }

  if (hasMin) {
    return `From ${formatter.format(salary_min || 0)} / ${periodLabel}`;
  }

  return `Up to ${formatter.format(salary_max || 0)} / ${periodLabel}`;
};

export const formatLocation = (value) => value || "Location not specified";

export const formatJobType = (value) =>
  value ? value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "Job";
