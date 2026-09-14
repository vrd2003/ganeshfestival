import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { sortRecords } from '../utils/sorting';

const useContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    sortBy: 'contributionDate',
    sortOrder: 'desc'
  });

  const loadContributions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
        params.sortOrder = filters.sortOrder;
      }
      const { data } = await api.fetchContributions(params);
      if (data.success) {
        setContributions(sortRecords(data.data, filters.sortBy, filters.sortOrder));
        setTotal(data.total);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contributions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadContributions();
  }, [loadContributions]);

  const addContribution = async (contributionData) => {
    const { data } = await api.createContribution(contributionData);
    if (data.success) {
      await loadContributions();
    }
    return data;
  };

  const editContribution = async (id, contributionData) => {
    const { data } = await api.updateContribution(id, contributionData);
    if (data.success) {
      await loadContributions();
    }
    return data;
  };

  const removeContribution = async (id) => {
    const { data } = await api.deleteContribution(id);
    if (data.success) {
      await loadContributions();
    }
    return data;
  };

  return {
    contributions,
    total,
    loading,
    error,
    filters,
    setFilters,
    refresh: loadContributions,
    addContribution,
    editContribution,
    removeContribution
  };
};

export default useContributions;
