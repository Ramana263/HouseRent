import { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Pagination, Badge } from 'react-bootstrap';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';

const initialFilters = {
  search: '',
  city: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
};

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState(initialFilters);

  const fetchProperties = useCallback(
    async (targetPage = 1) => {
      setLoading(true);
      setError('');
      try {
        const params = { ...filters, page: targetPage, limit: 9 };
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        const res = await api.get('/properties', { params });
        setProperties(res.data.properties || []);
        setPages(res.data.pages || 1);
        setPage(res.data.page || 1);
        setTotalCount(res.data.total || (res.data.properties ? res.data.properties.length : 0));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters]
  );

  useEffect(() => {
    fetchProperties(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(1);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    // Fetch immediately after resetting filters
    setTimeout(() => {
      setLoading(true);
      api.get('/properties', { params: { page: 1, limit: 9 } })
        .then(res => {
          setProperties(res.data.properties || []);
          setPages(res.data.pages || 1);
          setPage(1);
          setTotalCount(res.data.total || 0);
        })
        .catch(err => setError('Failed to reset filters'))
        .finally(() => setLoading(false));
    }, 50);
  };

  return (
    <div>
      {/* Hero Header */}
      <section className="hero-section text-center">
        <Container>
          <Badge bg="primary" className="bg-opacity-25 text-white border border-primary px-3 py-2 rounded-pill mb-3">
            ✨ Over 1,000+ Verified Rental Homes
          </Badge>
          <h1 className="hero-title">Find Your Ideal Place to Call Home</h1>
          <p className="hero-subtitle">
            Browse verified listings, schedule viewings, and send direct booking requests to trusted landlords in seconds.
          </p>
        </Container>
      </section>

      <Container className="mb-5">
        {/* Search Box Card */}
        <div className="search-box-card">
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              <Col lg={3} md={6}>
                <Form.Label className="form-label">Keyword / Title</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted"><i className="bi bi-search"></i></span>
                  <Form.Control
                    placeholder="e.g. Modern Studio, Villa..."
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                  />
                </div>
              </Col>

              <Col lg={2} md={6}>
                <Form.Label className="form-label">City</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted"><i className="bi bi-geo-alt"></i></span>
                  <Form.Control
                    placeholder="New York, LA..."
                    name="city"
                    value={filters.city}
                    onChange={handleChange}
                  />
                </div>
              </Col>

              <Col lg={2} md={4}>
                <Form.Label className="form-label">Property Type</Form.Label>
                <Form.Select name="type" value={filters.type} onChange={handleChange}>
                  <option value="">Any Type</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Villa</option>
                  <option>Studio</option>
                  <option>Condo</option>
                  <option>Room</option>
                </Form.Select>
              </Col>

              <Col lg={2} md={4}>
                <Form.Label className="form-label">Price Range ($)</Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    placeholder="Min"
                    name="minPrice"
                    type="number"
                    value={filters.minPrice}
                    onChange={handleChange}
                  />
                  <Form.Control
                    placeholder="Max"
                    name="maxPrice"
                    type="number"
                    value={filters.maxPrice}
                    onChange={handleChange}
                  />
                </div>
              </Col>

              <Col lg={1} md={4}>
                <Form.Label className="form-label">Beds</Form.Label>
                <Form.Select name="bedrooms" value={filters.bedrooms} onChange={handleChange}>
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </Form.Select>
              </Col>

              <Col lg={2} md={12} className="d-flex align-items-end gap-2">
                <Button type="submit" variant="primary" className="w-100 py-2">
                  <i className="bi bi-funnel-fill me-1"></i> Filter
                </Button>
                <Button type="button" variant="outline-secondary" className="py-2" onClick={handleReset} title="Reset search">
                  <i className="bi bi-arrow-counterclockwise"></i>
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        {/* Results Header */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
          <div>
            <h4 className="fw-bold mb-0">Featured Properties</h4>
            <span className="text-muted small">Showing {properties.length} {totalCount > 0 ? `of ${totalCount}` : ''} available listings</span>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {loading ? (
          <div className="text-center my-5 py-5">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Loading verified properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center my-5 py-5 bg-white rounded-4 shadow-sm border p-4">
            <i className="bi bi-house-x display-1 text-muted"></i>
            <h4 className="mt-3 fw-bold">No Properties Found</h4>
            <p className="text-muted">No rental properties match your search criteria. Try adjusting your filters.</p>
            <Button variant="primary" onClick={handleReset}>
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <Row xs={1} md={2} lg={3} className="g-4">
              {properties.map((p) => (
                <Col key={p._id}>
                  <PropertyCard property={p} />
                </Col>
              ))}
            </Row>

            {pages > 1 && (
              <Pagination className="justify-content-center mt-5">
                <Pagination.Prev disabled={page === 1} onClick={() => fetchProperties(page - 1)} />
                {Array.from({ length: pages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === page}
                    onClick={() => fetchProperties(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next disabled={page === pages} onClick={() => fetchProperties(page + 1)} />
              </Pagination>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Home;
