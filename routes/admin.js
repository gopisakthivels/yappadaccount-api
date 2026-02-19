// routes/admin.js
import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendInviteEmail } from '../utils/email.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Invite user (Admin only)
router.post('/invite-user', protect, requireAdmin, async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    // Temporary unique username so DB unique index (if not sparse) doesn't reject; user can set real one when they accept invite
    const pendingUsername = `invite_${crypto.randomBytes(8).toString('hex')}`;

    const newUser = await User.create({
      email,
      name: name || undefined,
      username: pendingUsername,
      inviteToken,
      inviteTokenExpiry,
      isActive: false,
      role: 'user',
      organizationId: req.user.organizationId,
    });

    // Send invite email (don't fail the request if email fails)
    const baseUrl = process.env.APP_URL || process.env.CLIENT_URL || 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/invite/verify?token=${inviteToken}`;
    let emailSent = false;
    try {
      await sendInviteEmail(email, name, inviteUrl);
      emailSent = true;
    } catch (emailErr) {
      console.error('Invite email failed (user was created):', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'User invited successfully',
      emailSent,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error('Error inviting user:', error);
    const message = error.message || 'Failed to invite user';
    const isValidation = error.name === 'ValidationError';
    const isMongo = error.code === 11000;
    res.status(isValidation ? 400 : isMongo ? 409 : 500).json({
      error: message,
      ...(process.env.NODE_ENV === 'development' && { details: error.toString() }),
    });
  }
});

// Get all users (Admin only)
router.get('/users', protect, requireAdmin, async (req, res) => {
  try {
    if (!req.user.organizationId) {
      return res.status(400).json({ error: 'Admin user must have an organizationId' });
    }

    const users = await User.find({ organizationId: req.user.organizationId })
      .select('-password -inviteToken -resetToken -resetTokenExpiry')
      .lean();

    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Toggle user active status (Admin only)
router.put('/users/:id/toggle-active', protect, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user.organizationId) {
      return res.status(400).json({ error: 'Admin user must have an organizationId' });
    }

    const user = await User.findOne({ 
      _id: id, 
      organizationId: req.user.organizationId 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found or does not belong to your organization' });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

export default router;