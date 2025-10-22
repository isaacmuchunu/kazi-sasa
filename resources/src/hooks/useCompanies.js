import { useState, useEffect } from 'react';
import companyService from '../services/companyService';
import { mapApiCompaniesToTemplate } from '../utils/mappers/companyMapper';

export const useCompanies = (filters = {}) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, [JSON.stringify(filters)]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAllCompanies(filters);
      const mappedCompanies = mapApiCompaniesToTemplate(response.data.data.data || response.data.data);
      setCompanies(mappedCompanies);
      
      if (response.data.data.meta) {
        setPagination(response.data.data.meta);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchCompanies();
  };

  return { companies, loading, error, pagination, refetch };
};

export default useCompanies;
