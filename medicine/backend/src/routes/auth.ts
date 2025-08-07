import { Router, Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { ApiResponse } from '../types';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

const router = Router();

// Register user
router.post('/register', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone
    });

    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error registering user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current user
router.get('/me', protect, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const user = await User.findById((req as any).user._id);
    
    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update user profile
router.put('/profile', protect, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { firstName, lastName, phone, address, dateOfBirth, medicalConditions, allergies } = req.body;
    
    const user = await User.findByIdAndUpdate(
      (req as any).user._id,
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

// Change password
router.put('/change-password', protect, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById((req as any).user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error changing password',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Forgot password
router.post('/forgot-password', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // TODO: Send email with reset link
    // For now, just return the token
    res.json({
      success: true,
      message: 'Password reset email sent',
      data: { resetToken }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reset password
router.post('/reset-password', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { token, newPassword } = req.body;
    
    // Verify token
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET!);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error resetting password',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 