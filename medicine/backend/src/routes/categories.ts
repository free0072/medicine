import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import Category from '../models/Category';

const router = Router();

// Get all categories
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name slug')
      .populate('children', 'name slug')
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

// Get category by slug
router.get('/:slug', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const category = await Category.findOne({ 
      slug: req.params.slug,
      isActive: true 
    })
    .populate('parent', 'name slug')
    .populate('children', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category retrieved successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 