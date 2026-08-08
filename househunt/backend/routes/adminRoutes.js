const express = require('express');
const {
  getStats,
  getPendingProperties,
  reviewProperty,
  getUsers,
  toggleUserActive,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require a valid token AND the 'admin' role
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/properties/pending', getPendingProperties);
router.put('/properties/:id/review', reviewProperty);
router.get('/users', getUsers);
router.put('/users/:id/toggle-active', toggleUserActive);

module.exports = router;
