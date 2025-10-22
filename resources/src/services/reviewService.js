import api from './api';

const reviewService = {
  /**
   * Get company reviews
   */
  getCompanyReviews: async (userId, params = {}) => {
    return api.get(`/users/${userId}/reviews/company`, { params });
  },

  /**
   * Get candidate reviews
   */
  getCandidateReviews: async (userId, params = {}) => {
    return api.get(`/users/${userId}/reviews/candidate`, { params });
  },

  /**
   * Create a review
   */
  createReview: async (reviewData) => {
    return api.post('/reviews', reviewData);
  },

  /**
   * Update a review
   */
  updateReview: async (id, reviewData) => {
    return api.put(`/reviews/${id}`, reviewData);
  },

  /**
   * Delete a review
   */
  deleteReview: async (id) => {
    return api.delete(`/reviews/${id}`);
  },
};

export default reviewService;
