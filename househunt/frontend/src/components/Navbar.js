import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Button, Dropdown, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <BsNavbar expand="lg" variant="dark" className="navbar-custom sticky-top">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center me-4">
          <div className="navbar-brand-logo">
            <i className="bi bi-house-heart-fill"></i>
            <span>HouseHunt</span>
          </div>
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="main-navbar" className="border-0 shadow-none">
          <span className="navbar-toggler-icon"></span>
        </BsNavbar.Toggle>

        <BsNavbar.Collapse id="main-navbar">
          <Nav className="me-auto align-items-center">
            <Nav.Link as={Link} to="/" className={`px-3 ${isActive('/') ? 'active' : ''}`}>
              <i className="bi bi-grid-fill me-1"></i> Browse Homes
            </Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/dashboard" className={`px-3 ${isActive('/dashboard') ? 'active' : ''}`}>
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </Nav.Link>
            )}
            {user && (
              <Nav.Link as={Link} to="/add-property" className={`px-3 ${isActive('/add-property') ? 'active' : ''}`}>
                <i className="bi bi-plus-circle-fill me-1"></i> List Property
              </Nav.Link>
            )}
            {user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin" className={`px-3 ${isActive('/admin') ? 'active' : ''}`}>
                <i className="bi bi-shield-lock-fill me-1"></i> Admin Panel
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="outline-light" 
                  id="user-dropdown" 
                  className="d-flex align-items-center gap-2 border-secondary bg-dark text-white rounded-pill px-3 py-1 shadow-sm"
                >
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 28, height: 28, fontSize: '0.85rem', fontWeight: 700 }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="fw-semibold small">{user.name}</span>
                  <Badge bg={user.role === 'admin' ? 'danger' : user.role === 'landlord' ? 'warning' : 'info'} className="text-dark small ms-1">
                    {user.role}
                  </Badge>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-dark shadow-lg border-secondary rounded-3 mt-2">
                  <Dropdown.Header className="text-white-50 small">Signed in as</Dropdown.Header>
                  <div className="px-3 py-1 fw-bold text-white small text-truncate" style={{ maxWidth: 200 }}>
                    {user.email}
                  </div>
                  <Dropdown.Divider className="border-secondary" />
                  <Dropdown.Item as={Link} to="/dashboard">
                    <i className="bi bi-person-lines-fill me-2 text-primary"></i> Dashboard & Requests
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/add-property">
                    <i className="bi bi-plus-square me-2 text-success"></i> Add New Listing
                  </Dropdown.Item>
                  {user.role === 'admin' && (
                    <Dropdown.Item as={Link} to="/admin">
                      <i className="bi bi-shield-check me-2 text-danger"></i> Admin Controls
                    </Dropdown.Item>
                  )}
                  <Dropdown.Divider className="border-secondary" />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i> Log Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light" 
                  className="px-3 rounded-pill btn-sm fw-semibold"
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Log In
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  className="px-3 rounded-pill btn-sm fw-semibold"
                >
                  <i className="bi bi-person-plus-fill me-1"></i> Register
                </Button>
              </div>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
