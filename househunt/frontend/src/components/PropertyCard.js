import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const defaultImages = [
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
];

const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Pick image or fallback
  const mainImage = property.images?.[0] && property.images[0].trim() !== ''
    ? property.images[0]
    : defaultImages[Math.abs(property.title?.length || 0) % defaultImages.length];

  return (
    <Card className="property-card">
      <div className="property-card-img-wrapper">
        <img
          src={mainImage}
          alt={property.title}
          className="property-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImages[0];
          }}
        />
        <span className="property-badge-type">
          <i className="bi bi-tag-fill me-1"></i> {property.type || 'Property'}
        </span>
        <span className="property-badge-price">
          ${property.price ? property.price.toLocaleString() : '0'}<small style={{ fontSize: '0.7em' }}>/mo</small>
        </span>
        <Button
          variant="light"
          size="sm"
          className="position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm"
          style={{ width: 34, height: 34, background: 'rgba(255, 255, 255, 0.9)' }}
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          title={isLiked ? 'Remove from saved' : 'Save property'}
        >
          <i className={`bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'}`}></i>
        </Button>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h5 className="card-title text-truncate fw-bold text-dark mb-0" style={{ maxWidth: '85%' }} title={property.title}>
            {property.title}
          </h5>
        </div>

        <p className="text-muted small mb-3 text-truncate">
          <i className="bi bi-geo-alt-fill text-primary me-1"></i>
          {property.location?.address ? `${property.location.address}, ` : ''}
          {property.location?.city || 'City'}
          {property.location?.state ? `, ${property.location.state}` : ''}
        </p>

        <div className="d-flex align-items-center gap-3 text-secondary small mb-3 pb-2 border-bottom">
          <span><i className="bi bi-door-open-fill text-muted me-1"></i>{property.bedrooms || 1} Beds</span>
          <span><i className="bi bi-droplet-fill text-muted me-1"></i>{property.bathrooms || 1} Baths</span>
          {property.areaSqft && <span><i className="bi bi-aspect-ratio-fill text-muted me-1"></i>{property.areaSqft} sqft</span>}
        </div>

        <Button
          as={Link}
          to={`/properties/${property._id}`}
          variant="outline-primary"
          className="mt-auto w-100 fw-semibold rounded-3 py-2 btn-sm d-flex align-items-center justify-content-center gap-1"
        >
          View Details <i className="bi bi-arrow-right small"></i>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
