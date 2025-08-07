import { Router, Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { ApiResponse, PaginatedResponse } from '../types';
import Review from '../models/Review';
import Product from '../models/Product';

const router = Router();

// Get reviews for a product
router.get('/product/:productId', async (req: Request, res: Response<PaginatedResponse<any>>) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;
    const reviews = await Review.find({ 
      product: productId,
      isVerified: true 
    })
    .populate('user', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Review.countDocuments({ 
      product: productId,
      isVerified: true 
    });

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

// Create review (requires authentication)
router.post('/', protect, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const { productId, rating, title, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      title,
      comment
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'firstName lastName')
      .populate('product', 'name');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populatedReview
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating review',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update review (requires authentication)
router.put('/:id', protect, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: req.params.id, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'firstName lastName')
      .populate('product', 'name');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: populatedReview
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating review',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete review (requires authentication)
router.delete('/:id', protect, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;

    const review = await Review.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user's reviews
router.get('/user/reviews', protect, async (req: Request, res: Response<PaginatedResponse<any>>) => {
  try {
    const userId = (req as any).user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;
    const reviews = await Review.find({ user: userId })
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      message: 'User reviews retrieved successfully',
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
      message: 'Error fetching user reviews',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 