import api from './api';

const blogService = {
  /**
   * Get all published blog posts
   */
  getAllPosts: async (params = {}) => {
    return api.get('/blog', { params });
  },

  /**
   * Get a single blog post by slug
   */
  getPostBySlug: async (slug) => {
    return api.get(`/blog/${slug}`);
  },

  /**
   * Get blog categories
   */
  getCategories: async () => {
    return api.get('/blog/categories');
  },

  /**
   * Get comments for a blog post
   */
  getComments: async (blogId) => {
    return api.get(`/blog/${blogId}/comments`);
  },

  /**
   * Add comment to a blog post
   */
  addComment: async (blogId, commentData) => {
    return api.post(`/blog/${blogId}/comments`, commentData);
  },
};

export default blogService;
