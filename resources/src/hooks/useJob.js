import { useState, useEffect } from 'react';
import jobService from '../services/jobService';

export const useJob = (id) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      setJob(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchJob();
  };

  return { job, loading, error, refetch };
};

export default useJob;
