import { apiRequest } from '../lib/queryClient';

export const authService = {
  async register(userData) {
    const response = await apiRequest('POST', '/api/auth/register', userData);
    return response.json();
  },

  async login(credentials) {
    const response = await apiRequest('POST', '/api/auth/login', credentials);
    return response.json();
  },

  async logout() {
    const response = await apiRequest('POST', '/api/auth/logout');
    return response.json();
  },

  async getCurrentUser() {
    const response = await apiRequest('GET', '/api/auth/me');
    return response.json();
  }
};