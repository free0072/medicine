import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  shortDescription: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  sku: {
    type: String,
    unique: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  // Medical specific fields
  activeIngredient: {
    type: String,
    trim: true
  },
  strength: {
    type: String,
    trim: true
  },
  dosageForm: {
    type: String,
    enum: ['tablet', 'capsule', 'liquid', 'cream', 'ointment', 'injection', 'inhaler', 'drops', 'suppository', 'patch', 'other'],
    trim: true
  },
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  controlledSubstance: {
    type: Boolean,
    default: false
  },
  expiryDate: Date,
  storageConditions: {
    type: String,
    trim: true
  },
  sideEffects: [String],
  contraindications: [String],
  drugInteractions: [String],
  pregnancyCategory: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'X', 'N/A'],
    default: 'N/A'
  },
  // Product status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePercentage: {
    type: Number,
    min: [0, 'Sale percentage cannot be negative'],
    max: [100, 'Sale percentage cannot exceed 100']
  },
  // SEO
  metaTitle: String,
  metaDescription: String,
  // Reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  // Tags for search
  tags: [String],
  // Shipping
  requiresColdStorage: {
    type: Boolean,
    default: false
  },
  fragile: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create slug from name
productSchema.pre('save', function(next) {
  if (!this.isModified('name') || this.slug) return next();
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  next();
});

// Virtual for sale price
productSchema.virtual('salePrice').get(function(): number {
  if (this.isOnSale && this.salePercentage && this.salePercentage > 0) {
    return this.price - (this.price * this.salePercentage / 100);
  }
  return this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function(): number {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IProduct>('Product', productSchema); 