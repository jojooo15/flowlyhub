import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAppContext } from '../hooks/useAppContext';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/dashboard');
      return;
    }

    // Tampilkan pesan sukses dari registrasi
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Hapus state setelah ditampilkan
      window.history.replaceState({}, document.title);
    }
  }, [user, navigate, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        
        {/* Demo credentials info */}
        <div className="demo-info">
          <h4>Demo Credentials:</h4>
          <p><strong>Email:</strong> admin@flowlyhub.com</p>
          <p><strong>Password:</strong> admin</p>
          <small>Atau gunakan akun yang telah Anda daftarkan</small>
        </div>
        
        <form onSubmit={handleSubmit}>          <div className="form-group">
            <div className="input-group">
              <div className="input-icon">
                <FaEnvelope />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>          <div className="form-group">
            <div className="input-group">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {successMessage && <div className="success-message">{successMessage}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>

          <div className="auth-links">
            <Link to="/forgot-password">Lupa Password?</Link>
            <Link to="/register">Daftar Akun Baru</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;