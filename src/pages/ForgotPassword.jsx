import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import '../styles/auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email input, 2: password reset
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { api } = useAppContext();  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);    try {
      const response = await api.auth.forgotPassword({ email });
      console.log('Forgot password response:', response);
      
      if (response.success) {
        // Simpan token dari response dan lanjut ke step 2
        if (response.resetToken) {
          setResetToken(response.resetToken);
          setStep(2);
        } else {
          // Jika tidak ada token dalam response, coba request lagi
          setError('Memproses request, silakan tunggu...');
          // Coba lagi dalam 1 detik untuk mendapatkan token
          setTimeout(async () => {
            try {
              const retryResponse = await api.auth.forgotPassword({ email });
              console.log('Retry response:', retryResponse);
              if (retryResponse.resetToken) {
                setResetToken(retryResponse.resetToken);
                setError('');
                setStep(2);
              } else {
                setError('Tidak dapat memproses reset password. Silakan coba lagi.');
              }
            } catch (retryErr) {
              console.error('Retry error:', retryErr);
              setError('Terjadi kesalahan. Silakan coba lagi.');
            }
          }, 1000);
        }
        
        // Show reset token in development mode for testing
        if (response.resetToken) {
          console.log('Reset token for testing:', response.resetToken);
        }
      } else {
        setError(response.message || 'Gagal memproses reset password. Silakan coba lagi.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handlePasswordSubmit = async (e) => {
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

    setLoading(true);    try {
      console.log('Starting password reset process...');
      
      // Jika tidak ada reset token, coba dapatkan lagi dari server
      let tokenToUse = resetToken;
      
      if (!tokenToUse) {
        console.log('No token available, requesting new one...');
        setError('Mendapatkan token reset, silakan tunggu...');
        const forgotResponse = await api.auth.forgotPassword({ email });
        console.log('New forgot password response:', forgotResponse);
        if (forgotResponse.resetToken) {
          tokenToUse = forgotResponse.resetToken;
          setResetToken(tokenToUse);
          setError(''); // Clear error setelah dapat token
        } else {
          setError('Tidak dapat memproses reset password. Silakan coba dari awal.');
          setLoading(false);
          return;
        }
      }

      const response = await api.auth.resetPassword(tokenToUse, {
        password: formData.password
      });
      console.log('Reset password response:', response);

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
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Lupa Password</h2>
          {step === 1 ? (
          <form onSubmit={handleSubmit}>
            <p className="auth-description">
              Masukkan email yang terdaftar. Anda akan dapat mengubah password langsung di halaman ini.
            </p>
            <div className="form-group">
              <div className="input-group">
                <div className="input-icon">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}            <div className="form-group">
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Loading...' : 'Lanjutkan Reset Password'}
              </button>
            </div>

            <div className="auth-links">
              <Link to="/login">Kembali ke Login</Link>
            </div>
          </form>        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <>
              <p className="auth-description">
                <strong>Email verified:</strong> {email}
              </p>
              <p className="auth-description">
                Masukkan password baru Anda di bawah ini:
              </p>
            </>

            <div className="form-group">
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password Baru"
                  value={formData.password}
                  onChange={handlePasswordChange}
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
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />
              </div>
            </div>            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Loading...' : 'Simpan Password Baru'}
              </button>
            </div><div className="auth-links">
              <button 
                type="button" 
                onClick={() => {
                  setStep(1);
                  setError('');
                  setFormData({ password: '', confirmPassword: '' });
                  setResetToken('');
                }} 
                className="link-button"
              >
                Kembali ke Input Email
              </button>
              {' | '}
              <Link to="/login">Kembali ke Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
