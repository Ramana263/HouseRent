import { useState } from 'react';
import { Form, Button, Alert, Modal, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: 'admin@househunt.com', password: 'password123' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e, customEmail = null, customPassword = null) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    
    const emailToUse = customEmail || form.email;
    const passwordToUse = customPassword || form.password;

    try {
      await login(emailToUse, passwordToUse);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillAndSubmitDemo = (email, password) => {
    setForm({ email, password });
    handleLoginSubmit(null, email, password);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="icon-wrapper">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <h3>Welcome Back</h3>
          <p>Log in to access your HouseHunt account</p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="py-2 small">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </Alert>
        )}

        <Form onSubmit={handleLoginSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0 text-muted">
                <i className="bi bi-envelope-fill"></i>
              </InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                required
                className="border-start-0"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <Form.Label className="mb-0">Password</Form.Label>
              <Button
                variant="link"
                className="p-0 text-decoration-none small text-primary fw-semibold"
                onClick={() => setShowForgotModal(true)}
                type="button"
              >
                Forgot password?
              </Button>
            </div>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0 text-muted">
                <i className="bi bi-key-fill"></i>
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                required
                className="border-start-0 border-end-0"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <Button
                variant="outline-secondary"
                className="bg-light border-start-0 text-muted"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3 d-flex align-items-center justify-content-between">
            <Form.Check
              type="checkbox"
              id="remember-me"
              label="Remember me"
              className="small text-muted"
              defaultChecked
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 py-2 fw-semibold" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              <>
                Log In <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
              </>
            )}
          </Button>
        </Form>

        {/* Demo Account Quick Logins */}
        <div className="demo-accounts-box mt-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h6>⚡ Quick Demo Logins</h6>
            <span className="badge bg-primary-subtle text-primary small">1-Click</span>
          </div>
          <div className="d-grid gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              className="demo-btn text-start d-flex justify-content-between align-items-center"
              onClick={() => fillAndSubmitDemo('tenant@househunt.com', 'password123')}
            >
              <span><i className="bi bi-person-heart me-1"></i> Demo Tenant (Renter)</span>
              <i className="bi bi-chevron-right small"></i>
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="demo-btn text-start d-flex justify-content-between align-items-center"
              onClick={() => fillAndSubmitDemo('owner@househunt.com', 'password123')}
            >
              <span><i className="bi bi-building-up me-1"></i> Demo Landlord (Owner)</span>
              <i className="bi bi-chevron-right small"></i>
            </Button>
            <Button
              variant="outline-dark"
              size="sm"
              className="demo-btn text-start d-flex justify-content-between align-items-center"
              onClick={() => fillAndSubmitDemo('admin@househunt.com', 'password123')}
            >
              <span><i className="bi bi-shield-check me-1"></i> Demo Admin</span>
              <i className="bi bi-chevron-right small"></i>
            </Button>
          </div>
        </div>

        <div className="text-center mt-4 pt-2 border-top">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/register" className="fw-bold text-primary text-decoration-none small">
            Create an Account
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="h5 fw-bold">Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          {forgotSent ? (
            <Alert variant="success" className="mb-0">
              <i className="bi bi-check-circle-fill me-2"></i>
              Password reset link sent to <strong>{forgotEmail}</strong>. Check your inbox!
            </Alert>
          ) : (
            <Form onSubmit={handleForgotSubmit}>
              <p className="text-muted small mb-3">
                Enter your registered email address and we'll send you instructions to reset your password.
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="light" onClick={() => setShowForgotModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Send Reset Link
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;
