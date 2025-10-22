import React from 'react';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  CurrencyDollarIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const JobStats = ({ job }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const stats = [
    {
      icon: BriefcaseIcon,
      label: 'Job Type',
      value: job.job_type?.replace(/_/g, ' ') || 'Not specified',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: MapPinIcon,
      label: 'Location',
      value: job.location || 'Remote',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: ClockIcon,
      label: 'Posted',
      value: formatDate(job.created_at),
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  if (job.experience_level) {
    stats.splice(3, 0, {
      icon: UserGroupIcon,
      label: 'Experience',
      value: job.experience_level.replace(/_/g, ' ') || 'Not specified',
      color: 'text-orange-600 bg-orange-50'
    });
  }

  if (job.salary_range) {
    stats.push({
      icon: CurrencyDollarIcon,
      label: 'Salary',
      value: job.salary_range,
      color: 'text-indigo-600 bg-indigo-50'
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${stat.color}`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs opacity-75">{stat.label}</span>
              <span className="text-xs font-semibold">{stat.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobStats;
