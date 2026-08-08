import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <Container>
        <Row className="g-4 mb-4">
          <Col lg={4} md={6}>
            <div className="navbar-brand-logo mb-3">
              <i className="bi bi-house-door-fill text-primary"></i> HouseHunt
            </div>
            <p className="small">
              Your premium destination for finding, renting, and listing verified residential properties. 
              Connecting tenants and property owners with trust and simplicity.
            </p>
          </Col>
          <Col lg={2} md={6}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-decoration-none text-muted">Browse Properties</Link></li>
              <li className="mb-2"><Link to="/login" className="text-decoration-none text-muted">Log In</Link></li>
              <li className="mb-2"><Link to="/register" className="text-decoration-none text-muted">Create Account</Link></li>
              <li className="mb-2"><Link to="/add-property" className="text-decoration-none text-muted">List a Property</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5>Property Types</h5>
            <ul className="list-unstyled small">
              <li className="mb-2"><span className="text-muted">Modern Apartments</span></li>
              <li className="mb-2"><span className="text-muted">Luxury Villas & Houses</span></li>
              <li className="mb-2"><span className="text-muted">Studios & Condos</span></li>
              <li className="mb-2"><span className="text-muted">Single Rooms & Flats</span></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5>Support & Contact</h5>
            <p className="small mb-1"><i className="bi bi-envelope me-2 text-primary"></i> support@househunt.com</p>
            <p className="small mb-1"><i className="bi bi-telephone me-2 text-primary"></i> +1 (800) 555-HUNT</p>
            <p className="small mb-0"><i className="bi bi-geo-alt me-2 text-primary"></i> 100 Real Estate Way, Suite 400</p>
          </Col>
        </Row>
        <hr className="my-4 border-secondary opacity-25" />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-muted">
          <div>&copy; {new Date().getFullYear()} HouseHunt Inc. All rights reserved.</div>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            <span className="text-muted">Privacy Policy</span>
            <span className="text-muted">Terms of Service</span>
            <span className="text-muted">Help Center</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
