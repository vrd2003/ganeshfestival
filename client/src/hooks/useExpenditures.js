import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const useExpenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    sortBy: 'expenseDate',
    sortOrder: 'desc'
  });

  const loadExpenditures = useCallback(async () => {
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
      const { data } = await api.fetchExpenditures(params);
      if (data.success) {
        setExpenditures(data.data);
        setTotal(data.total);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenditures');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadExpenditures();
  }, [loadExpenditures]);

  const addExpenditure = async (formData) => {
    const { data } = await api.createExpenditure(formData);
    if (data.success) {
      await loadExpenditures();
    }
    return data;
  };

  const editExpenditure = async (id, formData) => {
    const { data } = await api.updateExpenditure(id, formData);
    if (data.success) {
      await loadExpenditures();
    }
    return data;
  };

  const removeExpenditure = async (id) => {
    const { data } = await api.deleteExpenditure(id);
    if (data.success) {
      await loadExpenditures();
    }
    return data;
  };

  return {
    expenditures,
    total,
    loading,
    error,
    filters,
    setFilters,
    refresh: loadExpenditures,
    addExpenditure,
    editExpenditure,
    removeExpenditure
  };
};

export default useExpenditures;
