import api from './api';

const applicationService = {
  /**
   * Get applications for a job (employer only)
   */
  getJobApplications: async (jobId, params = {}) => {
    return api.get(`/jobs/${jobId}/applications`, { params });
  },

  /**
   * Get application details
   */
  getApplication: async (id) => {
    return api.get(`/applications/${id}`);
  },

  /**
   * Update application status (employer only)
   */
  updateStatus: async (id, data) => {
    return api.put(`/applications/${id}/status`, data);
  },

  /**
   * Shortlist application (employer only)
   */
  shortlist: async (id) => {
    return api.post(`/applications/${id}/shortlist`);
  },

  /**
   * Reject application (employer only)
   */
  reject: async (id, notes = null) => {
    return api.post(`/applications/${id}/reject`, { notes });
  },

  /**
   * Accept application (employer only)
   */
  accept: async (id, notes = null) => {
    return api.post(`/applications/${id}/accept`, { notes });
  },

  /**
   * Withdraw application (candidate only)
   */
  withdraw: async (id) => {
    return api.delete(`/applications/${id}/withdraw`);
  },
};

export default applicationService;
