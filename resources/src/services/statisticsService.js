import api from './api';

const statisticsService = {
  /**
   * Get global statistics for homepage
   */
  getGlobalStats: async () => {
    return api.get('/statistics/global');
  },

  /**
   * Get job statistics
   */
  getJobStats: async () => {
    return api.get('/statistics/jobs');
  },

  /**
   * Get dashboard statistics (authenticated)
   */
  getDashboardStats: async () => {
    return api.get('/statistics/dashboard');
  },
};

export default statisticsService;
