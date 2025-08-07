import { Router, Request, Response } from 'express';
import { ApiResponse, PaginatedResponse, ProductFilters } from '../types';
import Product from '../models/Product';

const router = Router();

// Get all products with filtering and pagination
router.get('/', async (req: Request, res: Response<PaginatedResponse<any>>) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 12));
    const {
      category,
      brand,
      priceMin,
      priceMax,
      inStock,
      prescriptionRequired,
      isOnSale,
      isFeatured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query as ProductFilters;

    const query: any = { isActive: true };
    
    // Category filter - handle both slug and ObjectId
    if (category) {
      // First try to find category by slug
      const Category = require('../models/Category').default;
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        // If not found by slug, try as ObjectId
        query.category = category;
      }
    }
    
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin);
      if (priceMax) query.price.$lte = parseFloat(priceMax);
    }
    if (inStock === 'true') query.stockQuantity = { $gt: 0 };
    if (prescriptionRequired === 'true') query.prescriptionRequired = true;
    if (isOnSale === 'true') query.isOnSale = true;
    if (isFeatured === 'true') query.isFeatured = true;
    
    // Search functionality - use regex instead of text search for better compatibility
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { activeIngredient: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get single product by slug
router.get('/:slug', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug,
      isActive: true 
    })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get featured products
router.get('/featured/featured', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const products = await Product.find({ 
      isFeatured: true,
      isActive: true 
    })
    .populate('category', 'name')
    .limit(8);

    res.json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get products on sale
router.get('/sale/on-sale', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const products = await Product.find({ 
      isOnSale: true,
      isActive: true 
    })
    .populate('category', 'name')
    .limit(8);

    res.json({
      success: true,
      message: 'Sale products retrieved successfully',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sale products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search products
router.get('/search/search', async (req: Request, res: Response<PaginatedResponse<any>>) => {
  try {
    const { q, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q as string, $options: 'i' } },
        { description: { $regex: q as string, $options: 'i' } },
        { brand: { $regex: q as string, $options: 'i' } },
        { activeIngredient: { $regex: q as string, $options: 'i' } }
      ],
      isActive: true
    })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

    const total = await Product.countDocuments({
      $or: [
        { name: { $regex: q as string, $options: 'i' } },
        { description: { $regex: q as string, $options: 'i' } },
        { brand: { $regex: q as string, $options: 'i' } },
        { activeIngredient: { $regex: q as string, $options: 'i' } }
      ],
      isActive: true
    });

    res.json({
      success: true,
      message: 'Search results retrieved successfully',
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 