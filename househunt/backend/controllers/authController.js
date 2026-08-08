const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @route  POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // Only allow 'admin' role to be self-assigned in dev/demo; in production restrict this.
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role === 'admin' ? 'admin' : role === 'landlord' ? 'landlord' : 'user',
    });

    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isActive) return res.status(403).json({ message: 'Account has been deactivated' });

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/auth/me
exports.updateMe = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, phone } },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
};
