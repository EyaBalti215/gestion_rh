import { apiFetch } from './services/api';

async function parseResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || 'Erreur API');
    err.response = res;
    err.data = data;
    throw err;
  }
  return { data };
}

const api = {
  get: async (path, options = {}) => {
    const res = await apiFetch(path, { method: 'GET', ...options });
    return parseResponse(res);
  },
  post: async (path, body, options = {}) => {
    const opts = { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), ...options };
    if (body instanceof FormData) delete opts.headers?.['Content-Type'];
    const res = await apiFetch(path, opts);
    return parseResponse(res);
  },
  put: async (path, body, options = {}) => {
    const opts = { method: 'PUT', body: typeof body === 'string' ? body : JSON.stringify(body), ...options };
    if (body instanceof FormData) delete opts.headers?.['Content-Type'];
    const res = await apiFetch(path, opts);
    return parseResponse(res);
  },
  delete: async (path, options = {}) => {
    const res = await apiFetch(path, { method: 'DELETE', ...options });
    return parseResponse(res);
  },
};

export default api;
