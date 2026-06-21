// Atlantic Optical - API Client
// Points to PHP backend on Banahosting

import type { Product, Category, ShippingRate, ExchangeRate, Order, User, PageSection, PricingResult, ApiResponse, PaginatedResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
}

// Products
export const productsAPI = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchAPI<{ products: Product[]; pagination: PaginatedResponse<Product>['pagination'] }>(`/products${query}`);
  },
  get: (id: number | string) =>
    fetchAPI<Product>(`/products?id=${id}`),
  create: (data: Partial<Product>) =>
    fetchAPI<{ id: number }>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Product>) =>
    fetchAPI<null>(`/products?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    fetchAPI<null>(`/products?id=${id}`, { method: 'DELETE' }),
};

// Categories
export const categoriesAPI = {
  list: () =>
    fetchAPI<Category[]>('/categories'),
  get: (slug: string) =>
    fetchAPI<Category>(`/categories?slug=${slug}`),
  create: (data: Partial<Category>) =>
    fetchAPI<{ id: number }>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Category>) =>
    fetchAPI<null>(`/categories?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    fetchAPI<null>(`/categories?id=${id}`, { method: 'DELETE' }),
};

// Shipping
export const shippingAPI = {
  getRates: (country?: string) => {
    const query = country ? `?country=${country}` : '';
    return fetchAPI<{ rates: ShippingRate[]; exchange_rate: ExchangeRate }>(`/shipping${query}`);
  },
  createRate: (data: Partial<ShippingRate>) =>
    fetchAPI<{ id: number }>('/shipping', { method: 'POST', body: JSON.stringify(data) }),
  updateRate: (id: number, data: Partial<ShippingRate>) =>
    fetchAPI<null>(`/shipping?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateExchangeRate: (usdToMxn: number) =>
    fetchAPI<null>('/shipping?action=exchange-rate', {
      method: 'PUT',
      body: JSON.stringify({ usd_to_mxn: usdToMxn, source: 'manual' }),
    }),
};

// Pricing
export const pricingAPI = {
  calculate: (productIds?: string, method?: string) => {
    const params = new URLSearchParams();
    if (productIds) params.set('product_ids', productIds);
    if (method) params.set('method', method);
    return fetchAPI<{ exchange_rate: number; shipping_methods: ShippingRate[]; products: PricingResult[] }>(`/pricing?${params.toString()}`);
  },
};

// Orders
export const ordersAPI = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchAPI<{ orders: Order[]; pagination: PaginatedResponse<Order>['pagination'] }>(`/orders${query}`);
  },
  get: (id: number) =>
    fetchAPI<Order>(`/orders?id=${id}`),
  create: (data: { items: { product_id: number; quantity: number }[]; shipping_method?: string; shipping_cost?: number }) =>
    fetchAPI<{ order_id: number; order_number: string; total: number }>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Order>) =>
    fetchAPI<null>(`/orders?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI<User>('/auth?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    fetchAPI<null>('/auth?action=logout', { method: 'POST' }),
  me: () =>
    fetchAPI<User>('/auth?action=me'),
};

// Settings
export const settingsAPI = {
  get: () =>
    fetchAPI<Record<string, { value: string; type: string }>>('/settings'),
  update: (data: Record<string, string>) =>
    fetchAPI<null>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// Sections (CMS)
export const sectionsAPI = {
  get: (page = 'home') =>
    fetchAPI<PageSection[]>(`/sections?page=${page}`),
  update: (data: Partial<PageSection>) =>
    fetchAPI<null>('/sections', { method: 'PUT', body: JSON.stringify(data) }),
};

// Import/Export
export const importAPI = {
  upload: (file: File, mode = 'create') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    return fetch(`${API_BASE}/import`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then(r => r.json()) as Promise<{ success: boolean; data?: { imported: number; errors: number } }>;
  },
};

export const exportAPI = {
  download: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    window.open(`${API_BASE}/export${query}`, '_blank');
  },
};

// Dashboard
export const dashboardAPI = {
  get: () =>
    fetchAPI<{ products: { total: number; published: number; drafts: number }; orders: { total: number; pending: number; revenue: number }; categories: { total: number }; recent_orders: Order[]; import_logs: unknown[] }>('/dashboard'),
};
