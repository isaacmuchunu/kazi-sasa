import api from './api';

const employerService = {
  /**
   * Get employer's company
   */
  getCompany: async () => {
    return api.get('/employer/company');
  },

  /**
   * Create company
   */
  createCompany: async (data) => {
    return api.post('/employer/company', data);
  },

  /**
   * Update company
   */
  updateCompany: async (data) => {
    return api.put('/employer/company', data);
  },

  /**
   * Upload company logo
   */
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post('/employer/company/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Get dashboard statistics
   */
  getDashboard: async () => {
    return api.get('/employer/dashboard');
  },

  /**
   * Get employer's jobs
   */
  getJobs: async (params = {}) => {
    return api.get('/employer/jobs', { params });
  },

  /**
   * Create job
   */
  createJob: async (data) => {
    return api.post('/employer/jobs', data);
  },

  /**
   * Update job
   */
  updateJob: async (id, data) => {
    return api.put(`/employer/jobs/${id}`, data);
  },

  /**
   * Delete job
   */
  deleteJob: async (id) => {
    return api.delete(`/employer/jobs/${id}`);
  },
};

export default employerService;
