import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { FaLock } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { api } = useAppContext();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token reset password tidak valid.');
        setVerifying(false);
        return;
      }

      try {
        const response = await api.auth.verifyResetToken(token);
        if (response.success) {
          setTokenValid(true);
          setUserInfo(response.data);
        } else {
          setError('Token reset password tidak valid atau sudah kedaluwarsa.');
        }
      } catch (err) {
        setError('Token reset password tidak valid atau sudah kedaluwarsa.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, api]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak sama. Silakan cek kembali.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password harus minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.auth.resetPassword(token, {
        password: formData.password
      });

      if (response.success) {
        navigate('/login', { 
          state: { message: 'Password berhasil diubah. Silakan login dengan password baru Anda.' }
        });
      } else {
        setError(response.message || 'Gagal mengubah password. Silakan coba lagi.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <LoadingSpinner />
          <p>Memverifikasi token reset password...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Token Tidak Valid</h2>
          <div className="error-message">
            {error || 'Token reset password tidak valid atau sudah kedaluwarsa.'}
          </div>
          <div className="auth-links">
            <a href="/forgot-password">Minta Link Reset Password Baru</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        {userInfo && (
          <p className="auth-description">
            Reset password untuk: <strong>{userInfo.email}</strong>
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <p className="auth-description">
            Silakan masukkan password baru Anda.
          </p>

          <div className="form-group">
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password Baru"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Loading...' : 'Simpan Password Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
