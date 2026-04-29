import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

export const getProblems = async (params = {}) => {
  const response = await api.get('/problems', { params });
  return response.data;
};

export const executeCode = async (language, sourceCode, stdin = '') => {
  const response = await api.post('/execute', { language, sourceCode, stdin });
  return response.data;
};

export const verifySolutionWithML = async (problemDescription, language, code, output) => {
  const response = await api.post('/ml/verify', { problemDescription, language, code, output });
  return response.data;
};

export default api;
