require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
const Booking = require('./models/Booking');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/househunt';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data.');

    // Create Demo Users
    const tenant = await User.create({
      name: 'Sarah Jenkins',
      email: 'tenant@househunt.com',
      password: 'password123',
      phone: '+1 (555) 234-5678',
      role: 'user',
    });

    const landlord = await User.create({
      name: 'Marcus Vance',
      email: 'owner@househunt.com',
      password: 'password123',
      phone: '+1 (555) 876-5432',
      role: 'landlord',
    });

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@househunt.com',
      password: 'password123',
      phone: '+1 (555) 000-1111',
      role: 'admin',
    });

    console.log('Demo users created:');
    console.log(' - Tenant: tenant@househunt.com / password123');
    console.log(' - Owner:  owner@househunt.com  / password123');
    console.log(' - Admin:  admin@househunt.com  / password123');

    // Create Sample Properties
    const properties = [
      {
        title: 'Modern Sunset Loft in Downtown',
        description: 'Spacious loft with high ceilings, polished concrete floors, floor-to-ceiling windows, and panoramic skyline views. Includes smart home automation and assigned indoor parking.',
        type: 'Apartment',
        price: 2850,
        bedrooms: 2,
        bathrooms: 2,
        areaSqft: 1400,
        location: {
          address: '742 Evergreen Terrace',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        },
        amenities: ['High-speed WiFi', 'Central Air', 'Gym Access', 'Underground Parking', 'Pet Friendly'],
        images: [
          'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        ],
        owner: landlord._id,
        status: 'approved',
        isAvailable: true,
      },
      {
        title: 'Contemporary Luxury Villa with Private Pool',
        description: 'An architectural masterpiece featuring open-concept living, private infinity pool, outdoor kitchen patio, master suite with spa bathroom, and smart security system.',
        type: 'Villa',
        price: 4500,
        bedrooms: 4,
        bathrooms: 3.5,
        areaSqft: 3200,
        location: {
          address: '1042 Ocean Drive',
          city: 'Miami',
          state: 'FL',
          zipCode: '33139',
        },
        amenities: ['Swimming Pool', 'Private Garden', 'Balcony', 'EV Charging', 'Washer & Dryer'],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        ],
        owner: landlord._id,
        status: 'approved',
        isAvailable: true,
      },
      {
        title: 'Charming Garden Cottage in Quiet Neighborhood',
        description: 'Cozy home with hardwood floors, updated country kitchen, stone fireplace, spacious private garden, and walking distance to parks and local cafes.',
        type: 'House',
        price: 1950,
        bedrooms: 3,
        bathrooms: 2,
        areaSqft: 1650,
        location: {
          address: '412 Maple Street',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
        },
        amenities: ['Fireplace', 'Backyard Garden', 'Garage', 'Hardwood Floors'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
        ],
        owner: landlord._id,
        status: 'approved',
        isAvailable: true,
      },
      {
        title: 'Sleek Minimalist Studio Near Financial District',
        description: 'Perfect for working professionals! Fully furnished studio apartment with modern appliances, high-speed fiber internet, and rooftop garden lounge.',
        type: 'Studio',
        price: 1600,
        bedrooms: 1,
        bathrooms: 1,
        areaSqft: 650,
        location: {
          address: '88 Wall Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10005',
        },
        amenities: ['Furnished', 'Rooftop Access', 'Elevator', '24/7 Security'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        ],
        owner: landlord._id,
        status: 'approved',
        isAvailable: true,
      },
    ];

    const createdProps = await Property.insertMany(properties);
    console.log(`Created ${createdProps.length} sample properties.`);

    // Create a sample booking
    await Booking.create({
      property: createdProps[0]._id,
      tenant: tenant._id,
      owner: landlord._id,
      moveInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      durationMonths: 6,
      message: 'Hi Marcus, I love this loft! Looking forward to moving in soon.',
      status: 'pending',
    });
    console.log('Created sample booking request.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
