import { Router, Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { ApiResponse } from '../types';
import Cart from '../models/Cart';
import Product from '../models/Product';

const router = Router();

// Apply auth middleware to all routes
router.use(protect);

// Get user's cart
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name images price stockQuantity prescriptionRequired');

    if (!cart) {
      // Create empty cart if doesn't exist
      const newCart = new Cart({ user: userId, items: [], subtotal: 0, total: 0 });
      await newCart.save();
      return res.json({
        success: true,
        message: 'Cart retrieved successfully',
        data: newCart
      });
    }

    res.json({
      success: true,
      message: 'Cart retrieved successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add item to cart
router.post('/add', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const { productId, quantity = 1 } = req.body;

    // Check if product exists and is active
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], subtotal: 0, total: 0 });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name images price stockQuantity prescriptionRequired');

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: populatedCart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding item to cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update cart item quantity
router.put('/update/:productId', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check stock
    const product = await Product.findById(productId);
    if (product && product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name images price stockQuantity prescriptionRequired');

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: populatedCart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Remove item from cart
router.delete('/remove/:productId', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name images price stockQuantity prescriptionRequired');

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: populatedCart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error removing item from cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Clear cart
router.delete('/clear', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], subtotal: 0, total: 0 }
    );

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 