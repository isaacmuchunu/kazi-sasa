import { useState, useEffect } from 'react';
import jobService from '../services/jobService';
import { mapApiJobsToTemplate } from '../utils/mappers/jobMapper';

export const useJobs = (filters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [JSON.stringify(filters)]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getAllJobs(filters);
      const mappedJobs = mapApiJobsToTemplate(response.data.data.data || response.data.data);
      setJobs(mappedJobs);
      
      if (response.data.data.meta) {
        setPagination(response.data.data.meta);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchJobs();
  };

  return { jobs, loading, error, pagination, refetch };
};

export default useJobs;
