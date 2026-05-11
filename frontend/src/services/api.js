import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (username, email, password, otp) => {
  const response = await api.post('/auth/register', { username, email, password, otp });
  return response.data;
};

export const sendOtp = async (email) => {
  const response = await api.post('/auth/send-otp', { email });
  return response.data;
};

export const verifyOtp = async (email, code) => {
  const response = await api.post('/auth/verify-otp', { email, code });
  return response.data;
};

export const socialAuth = async (userData) => {
  const response = await api.post('/auth/social-auth', userData);
  return response.data;
};

// Submissions
export const createSubmission = async (submissionData) => {
  const response = await api.post('/submissions', submissionData);
  return response.data;
};

export const getUserSolvedProblems = async (userId) => {
  const response = await api.get(`/submissions/user/${userId}`);
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
