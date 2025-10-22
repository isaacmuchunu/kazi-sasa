import api from './api';

const userService = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    return api.get('/user/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data) => {
    return api.put('/user/profile', data);
  },

  /**
   * Upload profile image
   */
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/user/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Change password
   */
  changePassword: async (passwords) => {
    return api.put('/user/password', passwords);
  },

  /**
   * Delete account
   */
  deleteAccount: async (password) => {
    return api.delete('/user/account', { data: { password } });
  },

  /**
   * Get user statistics
   */
  getStatistics: async () => {
    return api.get('/user/statistics');
  },

  /**
   * Get saved jobs
   */
  getSavedJobs: async (params = {}) => {
    return api.get('/user/saved-jobs', { params });
  },

  /**
   * Get applied jobs
   */
  getAppliedJobs: async (params = {}) => {
    return api.get('/user/applied-jobs', { params });
  },
};

export default userService;
