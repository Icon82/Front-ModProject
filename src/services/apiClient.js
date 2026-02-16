import { authService } from './authService';

export const apiClient = {
  get: async (url) => {
    return await apiClient.request(url, { method: 'GET' });
  },

  post: async (url, data) => {
    return await apiClient.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  request: async (url, options = {}) => {
    const token = authService.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      throw new Error('Sessione scaduta');
    }

    return response;
  }
};