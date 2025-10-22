import api from './api';

const candidateService = {
  /**
   * Get all candidates (public)
   */
  getAllCandidates: async (params = {}) => {
    return api.get('/candidates', { params });
  },

  /**
   * Get candidate by username (public)
   */
  getCandidateByUsername: async (username) => {
    return api.get(`/candidates/${username}`);
  },

  /**
   * Get own candidate profile
   */
  getProfile: async () => {
    return api.get('/candidate/profile');
  },

  /**
   * Update candidate profile
   */
  updateProfile: async (data) => {
    return api.put('/candidate/profile', data);
  },

  /**
   * Upload resume
   */
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/candidate/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Delete resume
   */
  deleteResume: async () => {
    return api.delete('/candidate/resume');
  },
};

export default candidateService;
