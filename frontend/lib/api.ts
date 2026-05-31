'use client';

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) config.headers.Authorization = ['Bearer', token].join(' ');
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return Promise.reject(error);

      const refresh = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/refresh`, {
        refreshToken,
      });
      localStorage.setItem('accessToken', refresh.data.accessToken);
      original.headers.Authorization = ['Bearer', refresh.data.accessToken].join(' ');
      return api(original);
    }
    return Promise.reject(error);
  }
);

export default api;
