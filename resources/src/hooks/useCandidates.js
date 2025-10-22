import { useState, useEffect } from 'react';
import candidateService from '../services/candidateService';
import { mapApiCandidatesToTemplate } from '../utils/mappers/candidateMapper';

export const useCandidates = (filters = {}) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, [JSON.stringify(filters)]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getAllCandidates(filters);
      const mappedCandidates = mapApiCandidatesToTemplate(response.data.data.data || response.data.data);
      setCandidates(mappedCandidates);

      if (response.data.data.meta) {
        setPagination(response.data.data.meta);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchCandidates();
  };

  return { candidates, loading, error, pagination, refetch };
};

export default useCandidates;
