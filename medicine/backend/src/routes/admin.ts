import { Router, Request, Response } from 'express';
import { protect, adminOnly } from '../middleware/auth';
import { ApiResponse, PaginatedResponse } from '../types';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import Category from '../models/Category';
import Review from '../models/Review';
import DemoDataGenerator from '../utils/demoDataGenerator';

const router = Router();

// Apply admin middleware to all routes
router.use(protect);
router.use(adminOnly);

// Dashboard Statistics
router.get('/dashboard', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(5);

    const lowStockProducts = await Product.find({
      stockQuantity: { $lte: '$lowStockThreshold' }
    }).limit(10);

    const pendingPrescriptions = await Order.find({
      prescriptionRequired: true,
      prescriptionApproved: false
    }).populate('user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        stats: {
          totalProducts,
          totalOrders,
          totalUsers,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        recentOrders,
        lowStockProducts,
        pendingPrescriptions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Product Management
router.get('/products', async (req: Request, res: Response<PaginatedResponse<any>>) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const status = req.query.status as string;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { activeIngredient: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }
    if (status) {
      query.isActive = status === 'active';
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ createdAt: -1 })
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
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/products', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.put('/products/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.delete('/products/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Order Management
router.get('/orders', async (req: Request, res: Response<PaginatedResponse<any>>) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const paymentStatus = req.query.paymentStatus as string;

    const query: any = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.put('/orders/:id/status', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating order status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Prescription Approval
router.put('/orders/:id/prescription', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { prescriptionApproved, notes } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        prescriptionApproved,
        notes: notes || order?.notes
      },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: `Prescription ${prescriptionApproved ? 'approved' : 'rejected'} successfully`,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating prescription status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Sales Analytics
router.get('/analytics/sales', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    res.json({
      success: true,
      message: 'Sales analytics retrieved successfully',
      data: {
        salesData,
        topProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// User Management
router.get('/users', async (req: Request, res: Response<PaginatedResponse<any>>) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const query: any = { role: 'user' };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Category Management
router.get('/categories', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name')
      .populate('children', 'name')
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/categories', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Review Management
router.get('/reviews', async (req: Request, res: Response<PaginatedResponse<any>>) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isVerified = req.query.isVerified as string;

    const query: any = {};
    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    const skip = (page - 1) * limit;
    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName')
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.put('/reviews/:id/verify', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).populate('user', 'firstName lastName')
     .populate('product', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review verified successfully',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error verifying review',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Demo Data Generation Routes
router.post('/demo/generate', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { type, quantity } = req.body;
    
    if (!type || !quantity || quantity < 1 || quantity > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters. Type and quantity (1-100) are required.'
      });
    }

    const generator = new DemoDataGenerator();
    
    switch (type) {
      case 'users':
        await generator.generateUsers(quantity);
        break;
      case 'categories':
        await generator.generateCategories(quantity);
        break;
      case 'products':
        await generator.generateProducts(quantity);
        break;
      case 'orders':
        await generator.generateOrders(quantity);
        break;
      case 'reviews':
        await generator.generateReviews(quantity);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid data type. Must be one of: users, categories, products, orders, reviews'
        });
    }

    res.json({
      success: true,
      message: `Generated ${quantity} ${type} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error generating ${req.body.type}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/demo/generate-all', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { quantities } = req.body;
    
    if (!quantities || typeof quantities !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Quantities object is required'
      });
    }

    const { users = 10, categories = 5, products = 20, orders = 15, reviews = 30 } = quantities;
    
    // Validate quantities
    const maxQuantity = 100;
    if (users > maxQuantity || categories > maxQuantity || products > maxQuantity || 
        orders > maxQuantity || reviews > maxQuantity) {
      return res.status(400).json({
        success: false,
        message: `Maximum quantity allowed is ${maxQuantity} for each type`
      });
    }

    const generator = new DemoDataGenerator();
    await generator.generateAll({ users, categories, products, orders, reviews });

    res.json({
      success: true,
      message: 'All demo data generated successfully',
      data: { quantities }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating demo data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.delete('/demo/clear', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const generator = new DemoDataGenerator();
    await generator.clearAllData();

    res.json({
      success: true,
      message: 'All demo data cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing demo data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/demo/stats', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const stats = {
      users: await User.countDocuments({ role: 'user' }),
      categories: await Category.countDocuments(),
      products: await Product.countDocuments(),
      orders: await Order.countDocuments(),
      reviews: await Review.countDocuments()
    };

    res.json({
      success: true,
      message: 'Demo data statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving demo data statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 