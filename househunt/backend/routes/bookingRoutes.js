const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('propertyId').notEmpty().withMessage('propertyId is required'),
    body('moveInDate').isISO8601().withMessage('Valid moveInDate is required'),
    body('durationMonths').isInt({ min: 1 }).withMessage('durationMonths must be at least 1'),
  ],
  createBooking
);

router.get('/mine', protect, getMyBookings);
router.get('/received', protect, getReceivedBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
