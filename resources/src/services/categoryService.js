import api from './api';

export const categoryService = {
  // Get all categories
  getCategories: (params = {}) => {
    return api.get('/categories', { params });
  },

  // Get single category by ID
  getCategory: (id) => {
    return api.get(`/categories/${id}`);
  },
};
