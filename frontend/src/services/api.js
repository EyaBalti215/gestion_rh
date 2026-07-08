const rawApiBaseUrl = import.meta.env.VITE_API_URL || '/api';
export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');
const AUTH_STORAGE_KEY = 'gestion-rh-auth';

function buildUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function apiFetch(path, options = {}) {
  let token = null;

  if (typeof window !== 'undefined') {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        token = JSON.parse(storedAuth)?.token;
      } catch {
        token = null;
      }
    }
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Ajouter le token s'il existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    headers,
    ...options,
  });

  return response;
}