/**
 * Data mapper to transform API candidate data to template format
 */

export const mapApiCandidateToTemplate = (apiCandidate) => {
  if (!apiCandidate) return null;

  return {
    id: apiCandidate.id,
    username: apiCandidate.user_name,
    firstName: apiCandidate.first_name,
    lastName: apiCandidate.last_name,
    fullName: `${apiCandidate.first_name} ${apiCandidate.last_name}`,
    email: apiCandidate.email,
    phone: apiCandidate.phone_number,
    profileImage: apiCandidate.profile_image || '/images/default-avatar.png',
    jobTitle: apiCandidate.job_title || '',
    bio: apiCandidate.bio || '',
    location: apiCandidate.location || '',
    experienceYears: apiCandidate.experience_years || 0,
    skills: apiCandidate.candidate_profile?.skills || [],
    experience: apiCandidate.candidate_profile?.experience || [],
    education: apiCandidate.candidate_profile?.education || [],
    certifications: apiCandidate.candidate_profile?.certifications || [],
    portfolioUrl: apiCandidate.candidate_profile?.portfolio_url || '',
    linkedinUrl: apiCandidate.candidate_profile?.linkedin_url || '',
    githubUrl: apiCandidate.candidate_profile?.github_url || '',
    resume: apiCandidate.candidate_profile?.resume || '',
    isPublic: apiCandidate.candidate_profile?.is_public || false,
    rating: apiCandidate.average_rating || 0,
    reviewsCount: apiCandidate.reviews_count || 0,
    createdAt: apiCandidate.created_at,
  };
};

export const mapApiCandidatesToTemplate = (apiCandidates) => {
  if (!Array.isArray(apiCandidates)) return [];
  return apiCandidates.map(mapApiCandidateToTemplate);
};

export default {
  mapApiCandidateToTemplate,
  mapApiCandidatesToTemplate,
};
