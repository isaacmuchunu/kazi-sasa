import { useState, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

export const useUserSavedJobs = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await userService.getSavedJobs();
      setSavedJobs(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchSavedJobs();
  };

  return { savedJobs, loading, error, refetch };
};

export default useUserSavedJobs;
