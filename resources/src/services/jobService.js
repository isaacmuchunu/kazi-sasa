import api from './api';

export const jobService = {
  // Get all jobs with filters
  getJobs: (params = {}) => {
    return api.get('/jobs', { params });
  },

  // Get single job by ID
  getJob: (id) => {
    return api.get(`/jobs/${id}`);
  },

  // Get related jobs
  getRelatedJobs: (id) => {
    return api.get(`/jobs/${id}/related`);
  },

  // Apply for a job (requires authentication)
  applyForJob: (id) => {
    return api.post(`/jobs/${id}/apply`);
  },

  // Save a job (requires authentication)
  saveJob: (id) => {
    return api.post(`/jobs/${id}/save`);
  },

  // Unsave a job (requires authentication)
  unsaveJob: (id) => {
    return api.delete(`/jobs/${id}/unsave`);
  },

  // Get user's saved jobs (requires authentication)
  getSavedJobs: (params = {}) => {
    return api.get('/user/saved-jobs', { params });
  },

  // Get user's applied jobs (requires authentication)
  getAppliedJobs: (params = {}) => {
    return api.get('/user/applied-jobs', { params });
  },
};
