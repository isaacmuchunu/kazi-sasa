import api from './api';

export const searchService = {
  // Search jobs
  searchJobs: (params = {}) => {
    return api.get('/search/jobs', { params });
  },

  // Search locations
  searchLocations: (query) => {
    return api.get('/search/locations', { params: { q: query } });
  },

  // Search categories
  searchCategories: (query) => {
    return api.get('/search/categories', { params: { q: query } });
  },
};
