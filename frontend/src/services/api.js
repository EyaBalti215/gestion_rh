const rawApiBaseUrl = import.meta.env.VITE_API_URL || '/api';
export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');
const AUTH_STORAGE_KEY = 'gestion-rh-auth';

function buildUrl(path) {
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (normalizedPath.startsWith(`${API_BASE_URL}/`)) {
    normalizedPath = normalizedPath.substring(API_BASE_URL.length);
  }

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
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

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