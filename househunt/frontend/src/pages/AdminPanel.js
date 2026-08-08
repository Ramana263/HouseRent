import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, pendingRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/properties/pending'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data || null);
      setPending(pendingRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const review = async (id, status) => {
    try {
      await api.put(`/admin/properties/${id}/review`, { status });
      setActionSuccess(`Property ${status} successfully.`);
      setTimeout(() => setActionSuccess(''), 3000);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to review property');
    }
  };

  const toggleActive = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle-active`);
      setActionSuccess(`User status updated.`);
      setTimeout(() => setActionSuccess(''), 3000);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  if (loading)
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted">Loading administrative platform data...</p>
      </div>
    );

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-shield-lock-fill text-primary me-2"></i> Admin Control Center
          </h2>
          <p className="text-muted small mb-0">System metrics, pending listing approvals, and user accounts</p>
        </div>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {actionSuccess && <Alert variant="success" dismissible onClose={() => setActionSuccess('')}>{actionSuccess}</Alert>}

      {/* Analytics Overview Cards */}
      {stats && (
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="p-3 rounded-4 shadow-sm border-0 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="fw-extrabold mb-0 text-primary">{stats.userCount || 0}</h2>
                  <span className="text-muted small">Registered Users</span>
                </div>
                <div className="rounded-3 bg-primary bg-opacity-10 text-primary p-3">
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="p-3 rounded-4 shadow-sm border-0 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="fw-extrabold mb-0 text-info">{stats.propertyCount || 0}</h2>
                  <span className="text-muted small">Total Listings</span>
                </div>
                <div className="rounded-3 bg-info bg-opacity-10 text-info p-3">
                  <i className="bi bi-building fs-4"></i>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="p-3 rounded-4 shadow-sm border-0 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="fw-extrabold mb-0 text-warning">{stats.pendingCount || 0}</h2>
                  <span className="text-muted small">Pending Approvals</span>
                </div>
                <div className="rounded-3 bg-warning bg-opacity-10 text-warning p-3">
                  <i className="bi bi-hourglass-split fs-4"></i>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="p-3 rounded-4 shadow-sm border-0 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="fw-extrabold mb-0 text-success">{stats.bookingCount || 0}</h2>
                  <span className="text-muted small">Total Bookings</span>
                </div>
                <div className="rounded-3 bg-success bg-opacity-10 text-success p-3">
                  <i className="bi bi-journal-check fs-4"></i>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabs */}
      <Card className="p-3 rounded-4 shadow-sm border-0 bg-white">
        <Tabs defaultActiveKey="pending" className="mb-4">
          <Tab
            eventKey="pending"
            title={
              <span>
                <i className="bi bi-clock-history me-1"></i> Pending Approvals{' '}
                <Badge bg="warning" className="text-dark ms-1">
                  {pending.length}
                </Badge>
              </span>
            }
          >
            {pending.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-check-all display-4 text-success"></i>
                <h5 className="mt-3 fw-bold">All Caught Up!</h5>
                <p className="text-muted small">There are no property listings currently awaiting review.</p>
              </div>
            ) : (
              <Table responsive hover align="middle">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Submitted By</th>
                    <th>City</th>
                    <th>Monthly Price</th>
                    <th className="text-end">Approval Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                    <tr key={p._id}>
                      <td className="fw-bold">{p.title}</td>
                      <td>
                        <div className="fw-semibold">{p.owner?.name || 'Owner'}</div>
                        <div className="text-muted small">{p.owner?.email}</div>
                      </td>
                      <td>{p.location?.city || 'N/A'}</td>
                      <td className="fw-bold text-primary">${p.price?.toLocaleString()}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Button size="sm" variant="success" onClick={() => review(p._id, 'approved')}>
                            <i className="bi bi-check-circle-fill me-1"></i> Approve
                          </Button>
                          <Button size="sm" variant="outline-danger" onClick={() => review(p._id, 'rejected')}>
                            <i className="bi bi-x-circle-fill me-1"></i> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>

          <Tab
            eventKey="users"
            title={
              <span>
                <i className="bi bi-people me-1"></i> User Management ({users.length})
              </span>
            }
          >
            <Table responsive hover align="middle">
              <thead className="table-light">
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th className="text-end">Toggle Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="fw-bold">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <Badge bg={u.role === 'admin' ? 'dark' : u.role === 'landlord' ? 'warning' : 'info'} className="text-uppercase">
                        {u.role}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={u.isActive ? 'success' : 'danger'}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant={u.isActive ? 'outline-danger' : 'outline-success'}
                        onClick={() => toggleActive(u._id)}
                      >
                        {u.isActive ? (
                          <>
                            <i className="bi bi-person-x-fill me-1"></i> Deactivate
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-check-fill me-1"></i> Activate
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
};

export default AdminPanel;
