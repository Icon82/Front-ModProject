// src/services/authService.js
export const login = async (username, password) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

export const logout = () => {
  localStorage.removeItem('token');
};
