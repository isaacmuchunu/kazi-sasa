import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  formatRelativeTime,
  formatSalaryRange,
  formatLocation,
  formatJobType,
} from "../utils/format";
import { 
  BookmarkIcon as BookmarkOutline, 
  HeartIcon as HeartOutline,
  ShareIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BriefcaseIcon,
  UserIcon,
  BookmarkIcon as BookmarkSolid,
  HeartIcon as HeartSolid
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const JobCard = ({ job }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const postedAgo = formatRelativeTime(job.created_at);
  const company = job.company ?? {};
  const category = job.category ?? {};

  useEffect(() => {
    // Check if job is saved
    if (user) {
      checkIfJobIsSaved();
    }
  }, [user, job.id]);

  const checkIfJobIsSaved = async () => {
    try {
      const response = await apiService.getSavedJobs();
      const savedJobs = response?.data?.data || [];
      setIsSaved(savedJobs.some(savedJob => savedJob.id === job.id));
    } catch (error) {
      console.error('Failed to check if job is saved:', error);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    try {
      if (isSaved) {
        await apiService.unsaveJob(job.id);
        setIsSaved(false);
      } else {
        await apiService.saveJob(job.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to save/unsave job:', error);
    }
  };

  const handleLikeJob = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setIsLiked(!isLiked);
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/jobs/${job.id}`;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=Check out this job: ${job.title}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Job URL copied to clipboard!');
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  const handleApplyNow = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (isApplying) return;

    try {
      setIsApplying(true);
      await apiService.applyToJob(job.id);
      window.location.href = `/jobs/${job.id}?applied=true`;
    } catch (error) {
      console.error('Failed to apply:', error);
      alert('Failed to apply. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            {formatJobType(job.job_type)}
          </p>
          <Link
            to={`/jobs/${job.id}`}
            className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-indigo-600"
          >
            {job.title}
          </Link>
        </div>
        {company.logo ? (
          <img
            src={company.logo}
            alt={`${company.name} logo`}
            className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
            {company.name?.slice(0, 2)?.toUpperCase() ?? "KS"}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="font-medium text-slate-700">{company.name ?? "Anonymous company"}</p>
        <p>{formatLocation(job.location)}</p>
        <p>{formatSalaryRange(job)}</p>
        {category.name && (
          <p className="text-slate-500">Category: {category.name}</p>
        )}
      </div>

      {/* Enhanced Job Stats */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm">
          <MapPinIcon className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700">{formatLocation(job.location)}</span>
        </div>
        {job.salary_min && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg text-sm">
            <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
            <span className="text-green-700">{formatSalaryRange(job)}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg text-sm">
          <ClockIcon className="h-4 w-4 text-blue-600" />
          <span className="text-blue-700">{postedAgo ? `Posted ${postedAgo}` : "Recently posted"}</span>
        </div>
        {job.experience_level && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg text-sm">
            <BriefcaseIcon className="h-4 w-4 text-purple-600" />
            <span className="text-purple-700 capitalize">{job.experience_level.replace('_', ' ')}</span>
          </div>
        )}
      </div>

      {/* Job Tags */}
      {(job.tags || job.skills_required) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(job.tags || job.skills_required || []).slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700"
            >
              {skill}
            </span>
          ))}
          {(job.tags || job.skills_required)?.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
              +{(job.tags || job.skills_required).length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {job.is_featured && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Featured role
          </span>
        )}
        {job.is_urgent && (
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
            Urgent
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Link
            to={`/jobs/${job.id}`}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-center font-medium text-white transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            View Details
          </Link>
          
          {/* Secondary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveJob}
              className={`p-2.5 rounded-lg transition-colors ${
                isSaved 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'bg-gray-50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              {isSaved ? (
                <BookmarkSolidIcon className="h-5 w-5" />
              ) : (
                <BookmarkOutline className="h-5 w-5" />
              )}
            </button>
            
            <div className="relative">
              <button
                className="p-2.5 rounded-lg bg-gray-50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Share job"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              
              {/* Share dropdown */}
              {showShareOptions && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowShareOptions(false)} />
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                    <button
                      onClick={() => handleShare('clipboard')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      LinkedIn
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Apply button */}
        <button
          onClick={handleApplyNow}
          disabled={isApplying}
          className="w-full mt-3 rounded-lg bg-green-600 px-4 py-2.5 text-center font-medium text-white transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApplying ? 'Applying...' : 'Quick Apply'}
        </button>
      </div>
    </article>
  );
};

export default JobCard;
