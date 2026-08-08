import { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const emptyForm = {
  title: '',
  description: '',
  type: 'Apartment',
  price: '',
  bedrooms: 1,
  bathrooms: 1,
  areaSqft: '',
  amenities: '',
  images: '',
  location: { city: '', state: '', address: '', zipCode: '' },
};

const sampleListings = [
  {
    title: 'Luxury Skyline Penthouse with River View',
    description: 'Stunning 3-bedroom penthouse featuring floor-to-ceiling glass windows, private balcony, marble kitchen island, and 24/7 concierge service.',
    type: 'Apartment',
    price: 3400,
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 1850,
    amenities: 'WiFi, Central AC, Gym, Swimming Pool, Parking, Balcony',
    images: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80, https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    location: { city: 'New York', state: 'NY', address: '450 West 42nd St', zipCode: '10036' },
  },
  {
    title: 'Cozy Modern Suburban Villa with Private Garden',
    description: 'Charming single-family home with modern kitchen, spacious backyard garden, garage, and quiet neighborhood close to top-rated schools.',
    type: 'Villa',
    price: 2600,
    bedrooms: 4,
    bathrooms: 3,
    areaSqft: 2400,
    amenities: 'Backyard, Garage, Washer & Dryer, Pet Friendly, Hardwood Floors',
    images: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80, https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    location: { city: 'Austin', state: 'TX', address: '1208 Elmwood Terrace', zipCode: '78704' },
  },
];

const AddProperty = () => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setForm({ ...form, location: { ...form.location, [field]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAutofill = () => {
    const randomSample = sampleListings[Math.floor(Math.random() * sampleListings.length)];
    setForm(randomSample);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        areaSqft: form.areaSqft ? Number(form.areaSqft) : undefined,
        amenities: form.amenities ? form.amenities.split(',').map((a) => a.trim()).filter(Boolean) : [],
        images: form.images ? form.images.split(',').map((a) => a.trim()).filter(Boolean) : [],
      };
      await api.post('/properties', payload);
      setSuccess('🎉 Property submitted successfully! It is now pending admin approval.');
      setTimeout(() => navigate('/dashboard'), 1600);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4" style={{ maxWidth: 800 }}>
      <Card className="p-4 p-md-5 rounded-4 shadow-sm border-0 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h3 className="fw-bold mb-1">List Your Property</h3>
            <p className="text-muted small mb-0">Fill out property details to reach thousands of prospective tenants.</p>
          </div>
          <Button variant="outline-primary" size="sm" onClick={handleAutofill} className="rounded-pill">
            ⚡ Autofill Sample Data
          </Button>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            <i className="bi bi-exclamation-circle-fill me-2"></i> {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success">
            <i className="bi bi-check-circle-fill me-2"></i> {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <h6 className="fw-bold text-primary text-uppercase small mb-3 border-bottom pb-2">
            <i className="bi bi-info-circle-fill me-1"></i> Basic Details
          </h6>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Property Title</Form.Label>
            <Form.Control
              name="title"
              placeholder="e.g. Sunny 2 Bedroom Apartment in Downtown"
              required
              value={form.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Describe nearby transport, layout, views, kitchen amenities, etc."
              required
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label">Property Type</Form.Label>
                <Form.Select name="type" value={form.type} onChange={handleChange}>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Villa</option>
                  <option>Studio</option>
                  <option>Condo</option>
                  <option>Room</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label">Monthly Rent ($ USD)</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light text-muted">$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min={0}
                    name="price"
                    placeholder="2500"
                    required
                    value={form.price}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* Specifications */}
          <h6 className="fw-bold text-primary text-uppercase small mb-3 border-bottom pb-2 mt-4">
            <i className="bi bi-sliders me-1"></i> Specifications
          </h6>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="form-label">Bedrooms</Form.Label>
                <Form.Control type="number" min={0} name="bedrooms" value={form.bedrooms} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="form-label">Bathrooms</Form.Label>
                <Form.Control type="number" min={0} name="bathrooms" value={form.bathrooms} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="form-label">Area (sq ft)</Form.Label>
                <Form.Control type="number" min={0} name="areaSqft" placeholder="1200" value={form.areaSqft} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          {/* Location */}
          <h6 className="fw-bold text-primary text-uppercase small mb-3 border-bottom pb-2 mt-4">
            <i className="bi bi-geo-alt-fill me-1"></i> Location Details
          </h6>

          <Row className="mb-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="form-label">Street Address</Form.Label>
                <Form.Control name="location.address" placeholder="123 Main Street, Apt 4B" required value={form.location.address} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="form-label">Zip Code</Form.Label>
                <Form.Control name="location.zipCode" placeholder="10001" value={form.location.zipCode} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label">City</Form.Label>
                <Form.Control name="location.city" placeholder="New York" required value={form.location.city} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label">State / Province</Form.Label>
                <Form.Control name="location.state" placeholder="NY" value={form.location.state} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          {/* Features & Photos */}
          <h6 className="fw-bold text-primary text-uppercase small mb-3 border-bottom pb-2 mt-4">
            <i className="bi bi-camera-fill me-1"></i> Amenities & Media
          </h6>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Amenities (Comma separated)</Form.Label>
            <Form.Control
              name="amenities"
              placeholder="High-speed WiFi, Covered Parking, Gym, In-unit Laundry, Balcony"
              value={form.amenities}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="form-label">Image URLs (Comma separated)</Form.Label>
            <Form.Control
              name="images"
              placeholder="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7"
              value={form.images}
              onChange={handleChange}
            />
            <Form.Text className="text-muted small">Enter one or multiple image URLs separated by commas.</Form.Text>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="button" variant="light" onClick={() => setForm(emptyForm)} className="py-2">
              Reset Form
            </Button>
            <Button type="submit" variant="primary" disabled={loading} className="flex-grow-1 py-2 fw-semibold">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting Listing...
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-upload-fill me-1"></i> Submit Property Listing
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddProperty;
