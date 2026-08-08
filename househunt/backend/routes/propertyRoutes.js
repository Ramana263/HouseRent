const express = require('express');
const { body } = require('express-validator');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const propertyValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type')
    .isIn(['Apartment', 'House', 'Villa', 'Studio', 'Condo', 'Room'])
    .withMessage('Invalid property type'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
];

router.get('/', getProperties);
router.get('/mine/list', protect, getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, propertyValidation, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
