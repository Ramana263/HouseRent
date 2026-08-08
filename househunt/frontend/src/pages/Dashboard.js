import { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Table, Badge, Button, Alert, Spinner, Row, Col, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';

const statusBadgeVariant = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  confirmed: 'success',
  cancelled: 'secondary',
};

const Dashboard = () => {
  const [myProperties, setMyProperties] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [propsRes, bookingsRes, receivedRes] = await Promise.all([
        api.get('/properties/mine/list'),
        api.get('/bookings/mine'),
        api.get('/bookings/received'),
      ]);
      setMyProperties(propsRes.data || []);
      setMyBookings(bookingsRes.data || []);
      setReceivedBookings(receivedRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const confirmDeleteProperty = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/properties/${deleteId}`);
      setShowDeleteModal(false);
      setDeleteId(null);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete property');
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  if (loading)
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted">Loading your dashboard account data...</p>
      </div>
    );

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Account Dashboard</h2>
          <p className="text-muted small mb-0">Overview of your property listings and booking requests</p>
        </div>
        <Button as={Link} to="/add-property" variant="primary" className="rounded-pill">
          <i className="bi bi-plus-circle-fill me-1"></i> Add New Listing
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="p-3 rounded-4 shadow-sm border-0 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, fontSize: '1.4rem' }}>
                <i className="bi bi-building"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0">{myProperties.length}</h3>
                <span className="text-muted small">My Listed Properties</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 rounded-4 shadow-sm border-0 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-3 bg-info bg-opacity-10 text-info d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, fontSize: '1.4rem' }}>
                <i className="bi bi-send-check"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0">{myBookings.length}</h3>
                <span className="text-muted small">My Booking Requests Sent</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 rounded-4 shadow-sm border-0 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-3 bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, fontSize: '1.4rem' }}>
                <i className="bi bi-inbox-fill"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0">{receivedBookings.length}</h3>
                <span className="text-muted small">Requests Received from Tenants</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card className="p-3 rounded-4 shadow-sm border-0 bg-white">
        <Tabs defaultActiveKey="listings" className="mb-4">
          {/* Listings Tab */}
          <Tab eventKey="listings" title={<span><i className="bi bi-houses-fill me-1"></i> My Listings ({myProperties.length})</span>}>
            {myProperties.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-house-plus display-4 text-muted"></i>
                <h5 className="mt-3 fw-bold">No Property Listings Yet</h5>
                <p className="text-muted small">You haven't added any properties for rent.</p>
                <Button as={Link} to="/add-property" variant="outline-primary" size="sm">
                  List Your First Property
                </Button>
              </div>
            ) : (
              <Table responsive hover align="middle">
                <thead className="table-light">
                  <tr>
                    <th>Property Title</th>
                    <th>City</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Available</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myProperties.map((p) => (
                    <tr key={p._id}>
                      <td className="fw-semibold">
                        <Link to={`/properties/${p._id}`} className="text-decoration-none text-dark">
                          {p.title}
                        </Link>
                      </td>
                      <td>{p.location?.city || 'N/A'}</td>
                      <td className="fw-bold text-primary">${p.price?.toLocaleString()}</td>
                      <td>
                        <Badge bg={statusBadgeVariant[p.status] || 'secondary'} className="text-uppercase px-2 py-1">
                          {p.status}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={p.isAvailable ? 'success' : 'secondary'}>
                          {p.isAvailable ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => {
                            setDeleteId(p._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <i className="bi bi-trash-fill"></i> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>

          {/* Sent Bookings Tab */}
          <Tab eventKey="bookings" title={<span><i className="bi bi-send-fill me-1"></i> My Sent Requests ({myBookings.length})</span>}>
            {myBookings.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-calendar-x display-4 text-muted"></i>
                <h5 className="mt-3 fw-bold">No Booking Requests Sent</h5>
                <p className="text-muted small">Explore properties and send rental requests to owners.</p>
                <Button as={Link} to="/" variant="primary" size="sm">
                  Browse Properties
                </Button>
              </div>
            ) : (
              <Table responsive hover align="middle">
                <thead className="table-light">
                  <tr>
                    <th>Property</th>
                    <th>Move-in Date</th>
                    <th>Lease Duration</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-semibold">{b.property?.title || 'Property N/A'}</td>
                      <td>{new Date(b.moveInDate).toLocaleDateString()}</td>
                      <td>{b.durationMonths} Months</td>
                      <td>
                        <Badge bg={statusBadgeVariant[b.status] || 'secondary'} className="text-uppercase px-2 py-1">
                          {b.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        {b.status === 'pending' && (
                          <Button size="sm" variant="outline-secondary" onClick={() => updateBookingStatus(b._id, 'cancelled')}>
                            Cancel Request
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>

          {/* Received Requests Tab */}
          <Tab eventKey="received" title={<span><i className="bi bi-inbox-fill me-1"></i> Tenant Requests ({receivedBookings.length})</span>}>
            {receivedBookings.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-envelope-check display-4 text-muted"></i>
                <h5 className="mt-3 fw-bold">No Tenant Inquiries Received</h5>
                <p className="text-muted small">When tenants request to book your properties, they will appear here.</p>
              </div>
            ) : (
              <Table responsive hover align="middle">
                <thead className="table-light">
                  <tr>
                    <th>Property</th>
                    <th>Applicant / Tenant</th>
                    <th>Move-in Date</th>
                    <th>Status</th>
                    <th className="text-end">Review Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-semibold">{b.property?.title || 'Property N/A'}</td>
                      <td>
                        <div className="fw-bold">{b.tenant?.name || 'Tenant'}</div>
                        <div className="text-muted small">{b.tenant?.email}</div>
                      </td>
                      <td>{new Date(b.moveInDate).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={statusBadgeVariant[b.status] || 'secondary'} className="text-uppercase px-2 py-1">
                          {b.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        {b.status === 'pending' && (
                          <div className="d-flex justify-content-end gap-2">
                            <Button size="sm" variant="success" onClick={() => updateBookingStatus(b._id, 'confirmed')}>
                              <i className="bi bi-check-lg me-1"></i> Confirm
                            </Button>
                            <Button size="sm" variant="outline-danger" onClick={() => updateBookingStatus(b._id, 'rejected')}>
                              <i className="bi bi-x-lg me-1"></i> Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>
        </Tabs>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-danger">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-0">
          Are you sure you want to permanently delete this property listing? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteProperty}>
            Delete Listing
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
