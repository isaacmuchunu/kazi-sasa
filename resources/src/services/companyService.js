import api from './api';

export const companyService = {
  // Get all companies
  getCompanies: (params = {}) => {
    return api.get('/companies', { params });
  },

  // Get single company by ID
  getCompany: (id) => {
    return api.get(`/companies/${id}`);
  },

  // Get jobs for a specific company
  getCompanyJobs: (id, params = {}) => {
    return api.get(`/companies/${id}/jobs`, { params });
  },
};
