// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  role: 'user' | 'admin';
  isVerified: boolean;
  avatar?: string;
  dateOfBirth?: string;
  medicalConditions?: string[];
  allergies?: string[];
  prescriptions?: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: Category | string;
  children?: Category[] | string[];
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  brand: string;
  category: Category | string;
  subcategory?: Category | string;
  images: string[];
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  activeIngredient?: string;
  strength?: string;
  dosageForm?: 'tablet' | 'capsule' | 'liquid' | 'cream' | 'ointment' | 'injection' | 'inhaler' | 'drops' | 'suppository' | 'patch' | 'other';
  prescriptionRequired: boolean;
  controlledSubstance: boolean;
  expiryDate?: string;
  storageConditions?: string;
  sideEffects?: string[];
  contraindications?: string[];
  drugInteractions?: string[];
  pregnancyCategory: 'A' | 'B' | 'C' | 'D' | 'X' | 'N/A';
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  salePercentage?: number;
  metaTitle?: string;
  metaDescription?: string;
  averageRating: number;
  totalReviews: number;
  tags?: string[];
  requiresColdStorage: boolean;
  fragile: boolean;
  salePrice: number;
  discountPercentage: number;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  product: Product | string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: User | string;
  items: CartItem[];
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
  prescriptionRequired?: boolean;
  prescriptionImage?: string;
  prescriptionApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  user: User | string;
  product: Product | string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Product Filters
export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  prescriptionRequired?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Admin Dashboard Types
export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export interface SalesData {
  _id: string;
  totalSales: number;
  orderCount: number;
}

export interface TopProduct {
  _id: string;
  totalSold: number;
  totalRevenue: number;
  product: Product;
}

// Form Types
export interface ProductFormData {
  name: string;
  description: string;
  shortDescription?: string;
  brand: string;
  category: string;
  subcategory?: string;
  images: string[];
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  weight?: number;
  activeIngredient?: string;
  strength?: string;
  dosageForm?: string;
  prescriptionRequired: boolean;
  controlledSubstance: boolean;
  expiryDate?: string;
  storageConditions?: string;
  sideEffects?: string[];
  contraindications?: string[];
  drugInteractions?: string[];
  pregnancyCategory: string;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  salePercentage?: number;
  tags?: string[];
  requiresColdStorage: boolean;
  fragile: boolean;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image?: string;
  parent?: string;
  sortOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  icon?: string;
} 