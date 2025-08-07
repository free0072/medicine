import { Request } from 'express';
import { Document } from 'mongoose';

// User Types
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
  dateOfBirth?: Date;
  medicalConditions?: string[];
  allergies?: string[];
  prescriptions?: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    endDate?: Date;
  }>;
  comparePassword(candidatePassword: string): Promise<boolean>;
  fullName: string;
  toJSON(): any;
}

// Category Types
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: ICategory | string;
  children?: ICategory[] | string[];
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  icon?: string;
}

// Product Types
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  brand: string;
  category: ICategory | string;
  subcategory?: ICategory | string;
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
  expiryDate?: Date;
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
}

// Order Types
export interface IOrderItem {
  product: IProduct | string;
  quantity: number;
  price: number;
  total: number;
}

export interface IOrder extends Document {
  user: IUser | string;
  items: IOrderItem[];
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
}

// Cart Types
export interface ICartItem {
  product: IProduct | string;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user: IUser | string;
  items: ICartItem[];
  subtotal: number;
  total: number;
}

// Review Types
export interface IReview extends Document {
  user: IUser | string;
  product: IProduct | string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
}

// Request Types
export interface AuthRequest extends Request {
  user?: IUser;
}

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

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Email Types
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// File Upload Types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

// Search and Filter Types
export interface ProductFilters {
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

// Pagination Types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 