const BASE =  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
//process.env.NEXT_PUBLIC_API_URL ||
function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('robo_token');
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(`${BASE}${path}`, { ...options, headers, cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
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
  addReview: (id, body) => apiFetch('/products/' + id + '/reviews', { method: 'POST', body: JSON.stringify(body) }),
  getTestimonials: () => apiFetch('/testimonials'),
  // Orders
  createOrder: (body) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getOrders: () => apiFetch('/orders'),
  getOrder: (id) => apiFetch('/orders/' + id),
  confirmBkash: (id, transactionId) => apiFetch('/orders/' + id + '/confirm-bkash', { method: 'POST', body: JSON.stringify({ transactionId }) }),
  // Newsletter
  subscribeNewsletter: (email) => apiFetch('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
};
