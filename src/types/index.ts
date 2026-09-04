// Atlantic Optical - TypeScript Types

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  short_description: string | null;
  base_cost_usd: number;
  weight_kg: number;
  margin: number;
  price_mxn: number;
  compare_price_mxn: number | null;
  category_id: number | null;
  category_name: string | null;
  category_slug: string | null;
  stock: number;
  status: 'draft' | 'published' | 'archived' | 'out_of_stock';
  is_featured: boolean;
  is_new: boolean;
  primary_image: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  price_modifier: number;
  stock: number;
  attributes: Record<string, string> | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
  product_count: number;
  children: Category[];
}

export interface ShippingRate {
  id: number;
  method: string;
  method_label: string;
  price_per_kg_usd: number;
  min_days: number;
  max_days: number;
  origin_country: string;
  destination_country: string;
  is_active: boolean;
}

export interface ExchangeRate {
  id: number;
  usd_to_mxn: number;
  source: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number | null;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  currency: string;
  shipping_method: string | null;
  shipping_address: Record<string, string> | null;
  billing_address: Record<string, string> | null;
  notes: string | null;
  customer_name: string | null;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'customer';
  avatar: string | null;
}

export interface PageSection {
  id: number;
  page: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  content: Record<string, unknown> | null;
  styles: Record<string, unknown> | null;
  sort_order: number;
  is_active: boolean;
}

export interface SiteSettings {
  [key: string]: {
    value: string;
    type: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface PricingResult {
  product_id: number;
  sku: string;
  name: string;
  base_cost_usd: number;
  weight_kg: number;
  margin: number;
  methods: {
    [key: string]: {
      label: string;
      price_mxn: number;
      shipping_cost_kg: number;
      total_shipping: number;
      delivery_days: string;
    };
  };
}
