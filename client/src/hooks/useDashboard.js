import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardSummary } from '../services/api';

const useDashboard = () => {
  const [summary, setSummary] = useState({
    totalContribution: 0,
    totalExpenditure: 0,
    balance: 0,
    totalContributors: 0,
    totalContributionEntries: 0,
    totalExpenditureEntries: 0,
    recentContributions: [],
    recentExpenditures: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchDashboardSummary();
      if (data.success) {
        setSummary(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return { summary, loading, error, refresh: loadSummary };
};

export default useDashboard;
