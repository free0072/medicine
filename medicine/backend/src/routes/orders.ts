import { Router, Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { ApiResponse, PaginatedResponse } from '../types';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';

const router = Router();

// Apply auth middleware to all routes
router.use(protect);

// Create order from cart
router.post('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const { 
      shippingAddress, 
      billingAddress, 
      paymentMethod,
      prescriptionImage 
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Check stock and prescription requirements
    const orderItems = [];
    let prescriptionRequired = false;

    for (const item of cart.items) {
      const product = item.product as any;
      
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      if (product.prescriptionRequired) {
        prescriptionRequired = true;
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        total: item.quantity * product.price
      });
    }

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      subtotal: cart.subtotal,
      tax: 0, // Calculate based on location
      shipping: 0, // Calculate based on shipping method
      total: cart.subtotal,
      paymentMethod,
      shippingAddress,
      billingAddress,
      prescriptionRequired,
      prescriptionImage
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], subtotal: 0, total: 0 }
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user orders
router.get('/', async (req: Request, res: Response<PaginatedResponse<any>>) => {
  try {
    const userId = (req as any).user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: userId });

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

// Get single order
router.get('/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const order = await Order.findOne({ 
      _id: req.params.id,
      user: userId 
    })
    .populate('items.product', 'name images description')
    .populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Cancel order
router.put('/:id/cancel', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const order = await Order.findOne({ 
      _id: req.params.id,
      user: userId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity }
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error cancelling order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 