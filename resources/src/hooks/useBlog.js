import { useState, useEffect } from 'react';
import blogService from '../services/blogService';

export const useBlog = (filters = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [JSON.stringify(filters)]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllPosts(filters);
      const blogsData = response.data.data.data || response.data.data;
      setBlogs(blogsData);

      if (response.data.data.meta) {
        setPagination(response.data.data.meta);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchBlogs();
  };

  return { blogs, loading, error, pagination, refetch };
};

export default useBlog;
