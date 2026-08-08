import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Form, Alert, Spinner, Card } from 'react-bootstrap';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const defaultImages = [
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
];

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const [bookingForm, setBookingForm] = useState({
    moveInDate: new Date().toISOString().split('T')[0],
    durationMonths: 6,
    message: '',
  });
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingErr, setBookingErr] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load property details'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingErr('');
    setBookingMsg('');

    if (!user) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/bookings', { propertyId: id, ...bookingForm });
      setBookingMsg('🎉 Booking request submitted! The property owner will review it shortly.');
    } catch (err) {
      setBookingErr(err.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted">Fetching property details...</p>
      </div>
    );

  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i> {error}
        </Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/" variant="outline-primary">
            <i className="bi bi-arrow-left me-1"></i> Back to Properties
          </Button>
        </div>
      </Container>
    );

  if (!property) return null;

  const images = property.images && property.images.length > 0 && property.images[0].trim() !== ''
    ? property.images
    : defaultImages;

  const isOwner = user && property.owner && property.owner._id === user._id;

  return (
    <Container className="my-4">
      {/* Back Button */}
      <div className="mb-3">
        <Link to="/" className="text-decoration-none text-muted small fw-semibold">
          <i className="bi bi-arrow-left me-1"></i> Back to search results
        </Link>
      </div>

      <Row className="g-4">
        {/* Main Details */}
        <Col lg={7}>
          {/* Main Image */}
          <div className="rounded-4 overflow-hidden shadow-sm mb-3 position-relative" style={{ maxHeight: 420 }}>
            <img
              src={images[activeImgIndex] || images[0]}
              alt={property.title}
              className="w-100 h-100 object-fit-cover"
              style={{ maxHeight: 420, objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImages[0];
              }}
            />
            <span className="property-badge-type">
              <i className="bi bi-tag-fill me-1"></i> {property.type}
            </span>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="d-flex gap-2 mb-4 overflow-auto pb-1">
              {images.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Thumbnail ${idx}`}
                  className={`rounded-3 cursor-pointer border ${idx === activeImgIndex ? 'border-primary border-3' : 'border-light'}`}
                  style={{ width: 90, height: 60, objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => setActiveImgIndex(idx)}
                />
              ))}
            </div>
          )}

          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
              <h2 className="fw-bold mb-0">{property.title}</h2>
              <div className="fs-3 fw-extrabold text-primary">
                ${property.price?.toLocaleString()} <span className="fs-6 text-muted font-normal">/ month</span>
              </div>
            </div>

            <p className="text-muted mb-3">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
              {property.location?.address}, {property.location?.city}
              {property.location?.state ? `, ${property.location.state}` : ''} {property.location?.zipCode}
            </p>

            <div className="d-flex flex-wrap gap-4 py-3 my-3 border-top border-bottom">
              <div>
                <span className="text-muted small d-block">Bedrooms</span>
                <span className="fw-bold fs-5"><i className="bi bi-door-open-fill me-1 text-primary"></i>{property.bedrooms}</span>
              </div>
              <div className="border-start ps-4">
                <span className="text-muted small d-block">Bathrooms</span>
                <span className="fw-bold fs-5"><i className="bi bi-droplet-fill me-1 text-primary"></i>{property.bathrooms}</span>
              </div>
              {property.areaSqft && (
                <div className="border-start ps-4">
                  <span className="text-muted small d-block">Area Size</span>
                  <span className="fw-bold fs-5"><i className="bi bi-aspect-ratio-fill me-1 text-primary"></i>{property.areaSqft} sqft</span>
                </div>
              )}
              <div className="border-start ps-4">
                <span className="text-muted small d-block">Status</span>
                <Badge bg={property.isAvailable ? 'success' : 'secondary'} className="mt-1">
                  {property.isAvailable ? 'Available Now' : 'Rented'}
                </Badge>
              </div>
            </div>

            <h5 className="fw-bold mb-2">Description</h5>
            <p className="text-secondary leading-relaxed mb-4">{property.description}</p>

            {property.amenities && property.amenities.length > 0 && (
              <>
                <h5 className="fw-bold mb-3">Amenities & Features</h5>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {property.amenities.map((amenity, i) => (
                    <span key={i} className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">
                      <i className="bi bi-check-circle-fill me-1"></i> {amenity}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Owner Info Box */}
            <div className="bg-light p-3 rounded-3 border d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 44, height: 44 }}>
                  {property.owner?.name ? property.owner.name.charAt(0).toUpperCase() : 'O'}
                </div>
                <div>
                  <div className="fw-bold">{property.owner?.name || 'Property Owner'}</div>
                  <div className="text-muted small"><i className="bi bi-envelope me-1"></i>{property.owner?.email || 'owner@househunt.com'}</div>
                </div>
              </div>
              {property.owner?.phone && (
                <a href={`tel:${property.owner.phone}`} className="btn btn-outline-secondary btn-sm rounded-pill">
                  <i className="bi bi-telephone-fill me-1"></i> {property.owner.phone}
                </a>
              )}
            </div>
          </div>
        </Col>

        {/* Booking Sidebar */}
        <Col lg={5}>
          {isOwner ? (
            <Card className="p-4 rounded-4 shadow-sm border text-center">
              <i className="bi bi-house-check display-3 text-primary mb-2"></i>
              <h5 className="fw-bold">This is Your Listing</h5>
              <p className="text-muted small">You are logged in as the owner of this property. Manage requests in your dashboard.</p>
              <Button as={Link} to="/dashboard" variant="primary" className="mt-2">
                <i className="bi bi-speedometer2 me-1"></i> Open Dashboard
              </Button>
            </Card>
          ) : (
            <Card className="p-4 rounded-4 shadow-sm border sticky-top" style={{ top: 90 }}>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <div>
                  <h5 className="fw-bold mb-0">Request Booking</h5>
                  <span className="text-muted small">Send direct inquiry to owner</span>
                </div>
                <div className="text-end">
                  <span className="fw-extrabold text-primary fs-4">${property.price?.toLocaleString()}</span>
                  <span className="text-muted small">/mo</span>
                </div>
              </div>

              {bookingMsg && <Alert variant="success" className="small">{bookingMsg}</Alert>}
              {bookingErr && <Alert variant="danger" className="small">{bookingErr}</Alert>}

              <Form onSubmit={handleBooking}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Preferred Move-in Date</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={bookingForm.moveInDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, moveInDate: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Lease Duration (Months)</Form.Label>
                  <Form.Select
                    value={bookingForm.durationMonths}
                    onChange={(e) => setBookingForm({ ...bookingForm, durationMonths: e.target.value })}
                  >
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months (Standard)</option>
                    <option value={12}>12 Months (1 Year)</option>
                    <option value={24}>24 Months (2 Years)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label">Message to Owner (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Introduce yourself, job/income status, or ask questions..."
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100 py-2 fw-semibold" disabled={bookingLoading}>
                  {bookingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting Request...
                    </>
                  ) : user ? (
                    <>
                      <i className="bi bi-send-fill me-1"></i> Send Booking Request
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-1"></i> Log In to Book
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3 text-muted small">
                <i className="bi bi-shield-check text-success me-1"></i> Free booking request &bull; No upfront card required
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyDetail;
