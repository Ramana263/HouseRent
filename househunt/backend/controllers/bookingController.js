const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @route  POST /api/bookings
// Private - tenant requests a booking on a property
exports.createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { propertyId, moveInDate, durationMonths, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.status !== 'approved' || !property.isAvailable) {
      return res.status(400).json({ message: 'Property is not available for booking' });
    }
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book your own property' });
    }

    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner,
      moveInDate,
      durationMonths,
      message,
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/bookings/mine
// Private - bookings the current user made as a tenant
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate('property')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/bookings/received
// Private - booking requests received on properties the user owns
exports.getReceivedBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property')
      .populate('tenant', 'name email phone')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/bookings/:id/status
// Private - owner confirms/rejects, tenant cancels
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validTransitions = ['confirmed', 'cancelled', 'rejected'];
    if (!validTransitions.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isTenant = booking.tenant.toString() === req.user._id.toString();

    if (status === 'cancelled' && !isTenant && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the tenant can cancel this booking' });
    }
    if (['confirmed', 'rejected'].includes(status) && !isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the property owner can update this booking' });
    }

    booking.status = status;
    await booking.save();

    if (status === 'confirmed') {
      await Property.findByIdAndUpdate(booking.property, { isAvailable: false });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};
