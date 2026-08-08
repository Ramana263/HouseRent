import { useState } from 'react';
import { Form, Button, Alert, InputGroup, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user', // default tenant/renter
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      };
      await register(payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    const randomId = Math.floor(Math.random() * 10000);
    setForm({
      name: `User ${randomId}`,
      email: `user${randomId}@househunt.com`,
      phone: '+1 555-0199',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'user',
    });
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-header">
          <div className="icon-wrapper">
            <i className="bi bi-person-badge-fill"></i>
          </div>
          <h3>Create Account</h3>
          <p>Join HouseHunt to search or list rental homes</p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="py-2 small">
            <i className="bi bi-exclamation-circle-fill me-2"></i> {error}
          </Alert>
        )}

        <Form onSubmit={handleRegisterSubmit}>
          {/* Role Choice */}
          <Form.Group className="mb-3">
            <Form.Label>Account Type</Form.Label>
            <div className="d-grid gap-2">
              <ButtonGroup className="w-100">
                <Button
                  type="button"
                  variant={form.role === 'user' ? 'primary' : 'outline-secondary'}
                  className="py-2 small"
                  onClick={() => setForm({ ...form, role: 'user' })}
                >
                  <i className="bi bi-search me-1"></i> I want to Rent
                </Button>
                <Button
                  type="button"
                  variant={form.role === 'landlord' ? 'primary' : 'outline-secondary'}
                  className="py-2 small"
                  onClick={() => setForm({ ...form, role: 'landlord' })}
                >
                  <i className="bi bi-building-add me-1"></i> I want to List Property
                </Button>
              </ButtonGroup>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0 text-muted">
                <i className="bi bi-person-fill"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="John Doe"
                required
                className="border-start-0"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </InputGroup>
          </Form.Group>

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
            <Form.Label>Phone Number (Optional)</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0 text-muted">
                <i className="bi bi-telephone-fill"></i>
              </InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="border-start-0"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0 text-muted">
                <i className="bi bi-lock-fill"></i>
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
                required
                minLength={6}
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

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0 text-muted">
                <i className="bi bi-check-circle-fill"></i>
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                required
                className="border-start-0"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </InputGroup>
          </Form.Group>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <Form.Check
              type="checkbox"
              id="terms-check"
              required
              label={
                <span className="small text-muted">
                  I agree to the <span className="text-primary">Terms</span> &{' '}
                  <span className="text-primary">Privacy Policy</span>
                </span>
              }
            />
            <Button
              type="button"
              variant="link"
              className="p-0 text-decoration-none small text-secondary"
              onClick={handleQuickFill}
            >
              ⚡ Fill Sample
            </Button>
          </div>

          <Button type="submit" variant="primary" className="w-100 py-2 fw-semibold" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : (
              <>
                Register Account <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
              </>
            )}
          </Button>
        </Form>

        <div className="text-center mt-4 pt-2 border-top">
          <span className="text-muted small">Already have an account? </span>
          <Link to="/login" className="fw-bold text-primary text-decoration-none small">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
