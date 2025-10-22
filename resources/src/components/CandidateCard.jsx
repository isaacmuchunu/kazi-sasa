import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, BriefcaseIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const CandidateCard = ({ candidate }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              src={candidate.profileImage}
              alt={`${candidate.firstName} ${candidate.lastName}`}
              className="h-16 w-16 rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/images/default-avatar.png';
              }}
            />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                <Link to={`/candidates/${candidate.username}`} className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">
                  {candidate.firstName} {candidate.lastName}
                </Link>
              </h3>
              {candidate.isPublic && (
                <div className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Public Profile
                </div>
              )}
            </div>
            <p className="text-gray-600">{candidate.jobTitle || 'Software Developer'}</p>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {candidate.location}
              </div>
              <div className="flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                {candidate.experienceYears} years exp.
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {candidate.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                  +{candidate.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Rating */}
        {candidate.rating > 0 && (
          <div className="mt-3 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-4 w-4 ${
                    index < Math.floor(candidate.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {candidate.rating} ({candidate.reviewsCount} reviews)
            </span>
          </div>
        )}

        {/* Bio Preview */}
        {candidate.bio && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {candidate.bio}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Member since {new Date(candidate.createdAt).getFullYear()}
          </div>
          <Link
            to={`/candidates/${candidate.username}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
