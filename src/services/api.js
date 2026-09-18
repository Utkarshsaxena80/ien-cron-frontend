// Frontend API Client Service

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || errorData.details || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  searchProducts: (query) => fetchJson(`/api/search?q=${encodeURIComponent(query)}`),
  getTrackedProducts: () => fetchJson('/api/tracked-products'),
  trackProduct: (productData) => fetchJson('/api/tracked-products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  untrackProduct: (id) => fetchJson(`/api/tracked-products/${id}`, {
    method: 'DELETE'
  }),
  getProductHistory: (id) => fetchJson(`/api/tracked-products/${id}/history`),
  getProductLogs: (id = 'all') => fetchJson(`/api/tracked-products/${id}/logs`),
  triggerBatchScrape: () => fetchJson('/api/scrape/run', {
    method: 'POST'
  })
};
