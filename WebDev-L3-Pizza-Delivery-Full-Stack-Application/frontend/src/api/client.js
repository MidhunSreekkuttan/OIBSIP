const API_BASE_URL = '/api';

export const apiFetch = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Determine token: prioritize adminToken when in admin sections or when requested
  const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const token = (isAdminPath || options.useAdminToken)
    ? (localStorage.getItem('adminToken') || localStorage.getItem('token'))
    : (localStorage.getItem('token') || localStorage.getItem('adminToken'));

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

