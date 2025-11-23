import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { signupUser, loginUser } from '../api/apiService';

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (username, password) => {
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const data = await loginUser(username, password);
        onLoginSuccess(data.username);
      } else {
        await signupUser(username, password);
        alert('Signup successful! Please log in to continue.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <style>{`
        .auth-container {
          min-height: 100vh;
          background: #0f0f0f;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        .auth-form-wrapper {
          width: 100%;
          max-width: 400px;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 2.5rem 2rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #f5f5f5;
          text-align: center;
          letter-spacing: -0.5px;
        }

        .auth-subtitle {
          text-align: center;
          color: #b0b0b0;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
      `}</style>

      <div className="auth-form-wrapper">
        <h1 className="auth-title">EmotiX</h1>
        <p className="auth-subtitle">Track your emotions, find your balance</p>
        <AuthForm
          isLogin={isLogin}
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
          toggleAuthMode={() => setIsLogin(!isLogin)}
        />
      </div>
    </div>
  );
};

export default AuthPage;