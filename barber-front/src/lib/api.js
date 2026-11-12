import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@BarberFlow:token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !error.config._retry && !isAuthRoute) {
      error.config._retry = true;
      localStorage.removeItem('@BarberFlow:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);