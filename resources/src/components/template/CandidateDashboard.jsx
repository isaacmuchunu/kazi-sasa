import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  BellIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import apiService from '../../services/api';

const CandidateDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activityResponse, recommendationsResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getDashboardActivity(),
        apiService.getRecommendations()
      ]);

      setStats(statsResponse?.data?.stats);
      setActivity(activityResponse?.data || []);
      setRecommendations(recommendationsResponse?.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'reviewing':
        return 'text-blue-600 bg-blue-50';
      case 'shortlisted':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your job applications and profile</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.total_applications || 0}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <BriefcaseIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.pending_applications || 0}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.accepted_applications || 0}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.saved_jobs || 0}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      {stats?.profile_completion && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
            <span className="text-2xl font-bold text-indigo-600">{stats.profile_completion.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${stats.profile_completion.percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Complete your profile to increase your chances of getting hired
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            {activity.length > 0 ? (
              <div className="space-y-4">
                {activity.map((item, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        {item.type === 'application' ? (
                          <BriefcaseIcon className="h-4 w-4 text-indigo-600" />
                        ) : (
                          <UserGroupIcon className="h-4 w-4 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                        {item.status && (
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <Link to="/jobs" className="text-indigo-600 hover:text-indigo-700 font-medium mt-2">
                  Browse jobs to get started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Jobs</h3>
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.slice(0, 5).map((job) => (
                  <div key={job.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-gray-900 text-sm hover:text-indigo-600 cursor-pointer">
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{job.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <CurrencyDollarIcon className="h-3 w-3" />
                        {job.salary_range}
                      </span>
                    </div>
                    {job.match_score && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Match:</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${job.match_score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-green-600">{job.match_score}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ArrowTrendingUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-sm">No recommendations yet</p>
                <p className="text-xs text-gray-400 mt-1">Apply to jobs to get personalized recommendations</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/dashboard/applications"
                className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BriefcaseIcon className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-900">View Applications</span>
                </div>
                <span className="text-indigo-600">→</span>
              </Link>
              <Link
                to="/dashboard/saved-jobs"
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Saved Jobs</span>
                </div>
                <span className="text-purple-600">→</span>
              </Link>
              <Link
                to="/dashboard/profile"
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Edit Profile</span>
                </div>
                <span className="text-green-600">→</span>
              </Link>
              <Link
                to="/dashboard/resume"
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Upload Resume</span>
                </div>
                <span className="text-blue-600">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
