const { validationResult } = require('express-validator');
const Property = require('../models/Property');

// @route  GET /api/properties
// Public - only approved & available listings, with filters + pagination
exports.getProperties = async (req, res, next) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      type,
      bedrooms,
      search,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    const filter = { status: 'approved', isAvailable: true };

    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (type) filter.type = type;
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('owner', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/properties/:id
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/properties
// Private (any authenticated user can list a property; goes to pending)
exports.createProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const property = await Property.create({
      ...req.body,
      owner: req.user._id,
      status: 'pending',
    });

    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/properties/:id
// Private - owner or admin only
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const isOwner = property.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this property' });
    }

    // Non-admins editing content should reset status back to pending for re-approval
    const updates = { ...req.body };
    if (req.user.role !== 'admin') {
      delete updates.status;
      property.status = 'pending';
    }

    Object.assign(property, updates);
    await property.save();
    res.json(property);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/properties/:id
// Private - owner or admin only
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const isOwner = property.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted' });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/properties/mine/list
// Private - properties owned by the logged in user
exports.getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort('-createdAt');
    res.json(properties);
  } catch (err) {
    next(err);
  }
};
