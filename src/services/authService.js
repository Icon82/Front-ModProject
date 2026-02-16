
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
export const authService = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Login fallito');
    }

    return await response.json();
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('expireDate');
    localStorage.removeItem('permessi');
    localStorage.removeItem('username');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const expireDate = localStorage.getItem('expireDate');
    
    if (!token || !expireDate) {
      return false;
    }

    return new Date(expireDate) > new Date();
  },

  getUserRoles: () => {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  },

  getPermessi: () => {
    return parseInt(localStorage.getItem('permessi')) || 0;
  },

  hasRole: (roleName) => {
    const roles = authService.getUserRoles();
    return roles.some(role => role.name === roleName);
  }
};