import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api'
});


// ============ Dashboard ============
export const fetchDashboardSummary = () => API.get('/dashboard/summary');

// ============ Contributions ============
export const fetchContributions = (params) => API.get('/contributions', { params });
export const fetchContributionById = (id) => API.get(`/contributions/${id}`);
export const createContribution = (data) => API.post('/contributions', data);
export const updateContribution = (id, data) => API.put(`/contributions/${id}`, data);
export const deleteContribution = (id) => API.delete(`/contributions/${id}`);

// ============ Expenditures ============
export const fetchExpenditures = (params) => API.get('/expenditures', { params });
export const fetchExpenditureById = (id) => API.get(`/expenditures/${id}`);
export const createExpenditure = (formData) =>
  API.post('/expenditures', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const updateExpenditure = (id, formData) =>
  API.put(`/expenditures/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const deleteExpenditure = (id) => API.delete(`/expenditures/${id}`);
