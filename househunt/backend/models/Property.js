const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['Apartment', 'House', 'Villa', 'Studio', 'Condo', 'Room'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    location: {
      city: { type: String, required: true },
      state: { type: String },
      address: { type: String, required: true },
      zipCode: { type: String },
    },
    amenities: [{ type: String }],
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    areaSqft: { type: Number },
    images: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

propertySchema.index({ 'location.city': 1, price: 1, type: 1 });
propertySchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Property', propertySchema);
