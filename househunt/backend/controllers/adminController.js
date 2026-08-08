const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @route  GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [userCount, propertyCount, pendingCount, bookingCount] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Property.countDocuments({ status: 'pending' }),
      Booking.countDocuments(),
    ]);
    res.json({ userCount, propertyCount, pendingCount, bookingCount });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/properties/pending
exports.getPendingProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: 'pending' })
      .populate('owner', 'name email')
      .sort('-createdAt');
    res.json(properties);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/admin/properties/:id/review
exports.reviewProperty = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });

    res.json(property);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/admin/users/:id/toggle-active
exports.toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};
