const BASE =
  process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.length > 0
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:4000/api';

  //change the api link

const TOKEN_KEY = 'robo_token';
const USER_KEY = 'robo_user';

export const AUTH_LOGOUT_EVENT = 'robo:auth:logout';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor({ status, message, data, cause }) {
    super(message || 'API error');
    this.name = 'ApiError';
    this.status = status ?? 0;
    this.data = data ?? null;
    if (cause) this.cause = cause;
  }
}

function isTokenExpiredMessage(msg) {
  if (!msg) return false;
  const m = String(msg).toLowerCase();
  return (
    m.includes('token expired') ||
    m.includes('invalid token') ||
    m.includes('user no longer exists') ||
    m.includes('please login to access this route')
  );
}

function triggerLogout(reason) {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
  try { localStorage.removeItem(USER_KEY); } catch {}
  try {
    window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT, { detail: { reason } }));
  } catch {}
}

function extractMessage(data, status) {
  if (!data || typeof data !== 'object') {
    if (status === 401) return 'Your session has expired. Please sign in again.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'The requested resource was not found.';
    if (status >= 500) return 'The server encountered an error. Please try again later.';
    return `Request failed (${status || 'network'})`;
  }

  return (
    data.message ||
    data.error ||
    data.errorMessage ||
    data.statusMessage ||
    (Array.isArray(data.errors) && data.errors.map((e) => e.msg || e.message).filter(Boolean).join(', ')) ||
    (status === 401 ? 'Your session has expired. Please sign in again.' : null) ||
    (status === 403 ? 'You do not have permission to perform this action.' : null) ||
    (status === 404 ? 'The requested resource was not found.' : null) ||
    (status >= 500 ? 'The server encountered an error. Please try again later.' : null) ||
    'API error'
  );
}

async function parseResponse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers, cache: 'no-store' });
  } catch (err) {
    throw new ApiError({
      status: 0,
      message: 'Network error. Please check your connection and try again.',
      cause: err,
    });
  }

  const data = await parseResponse(res);

  if (res.ok) return data;

  if (res.status === 401) {
    const msg = extractMessage(data, res.status);
    if (isTokenExpiredMessage(msg) || (token && res.status === 401)) {
      triggerLogout(msg);
    }
  }

  throw new ApiError({
    status: res.status,
    message: extractMessage(data, res.status),
    data,
  });
}

export const api = {
  // Auth
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => apiFetch('/auth/me'),
  updateProfile: (body) => apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Catalog
  getCategories: () => apiFetch('/categories'),
  getProducts: (params = {}) => apiFetch('/products?' + new URLSearchParams(params)),
  getProduct: (id) => apiFetch('/products/' + id),
  addReview: (id, body) =>
    apiFetch('/products/' + id + '/reviews', { method: 'POST', body: JSON.stringify(body) }),
  getTestimonials: () => apiFetch('/testimonials'),

  // Orders
  createOrder: (body) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getOrders: () => apiFetch('/orders'),
  getOrder: (id) => apiFetch('/orders/' + id),

  // bKash Tokenized Payment Gateway
  bkashCreatePayment: (body) =>
    apiFetch('/payments/bkash/create', { method: 'POST', body: JSON.stringify(body) }),
  bkashHealth: () => apiFetch('/payments/bkash/health'),

  // Newsletter
  subscribeNewsletter: (email) =>
    apiFetch('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
};
