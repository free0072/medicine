import { Router, Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { ApiResponse } from '../types';
import User from '../models/User';

const router = Router();

// Apply auth middleware to all routes
router.use(protect);

// Get user profile
router.get('/profile', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const user = await User.findById(userId);

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update user profile
router.put('/profile', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user._id;
    const { firstName, lastName, phone, address, dateOfBirth, medicalConditions, allergies } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phone,
        address,
        dateOfBirth,
        medicalConditions,
        allergies
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 