// backend/controllers/customerAuthController.js
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new customer
// @route   POST /api/auth/customer/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Capture new fields: fullAddress, il, ilce
  const { name, email, password, fullAddress, il, ilce } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    fullAddress,
    il,
    ilce,
    role: 'customer',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      fullAddress: user.fullAddress, // Updated field
      il: user.il,                   // Added
      ilce: user.ilce,               // Added
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/customer/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, role: 'customer' });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      fullAddress: user.fullAddress, // Updated field
      il: user.il,                   // Added
      ilce: user.ilce,               // Added
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/customer/me
// @access  Private (Customer)
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user now contains fullAddress, il, ilce
    res.json(req.user);
});

export { registerUser, authUser, getUserProfile };