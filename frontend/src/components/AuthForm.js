import React, { useState } from 'react';

const AuthForm = ({ isLogin, onSubmit, error, loading, toggleAuthMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onSubmit(username, password);
    }
  };

  return (
    <div className="auth-form">
      <style>{`
        .auth-form {
          width: 100%;
        }

        .auth-form h2 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #f5f5f5;
          text-align: center;
        }

        .auth-form form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group input {
          padding: 0.85rem 1rem;
          background: #242424;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #f5f5f5;
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .form-group input::placeholder {
          color: #606060;
        }

        .form-group input:focus {
          outline: none;
          background: #2d2d2d;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-bottom: 0.5rem;
        }

        .submit-btn {
          padding: 0.9rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
          margin-top: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .toggle-auth {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: #b0b0b0;
        }

        .toggle-auth button {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          padding: 0;
          text-decoration: underline;
        }

        .toggle-auth button:hover:not(:disabled) {
          color: #2563eb;
        }

        .toggle-auth button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 512px) {
          .auth-form h2 {
            font-size: 1.2rem;
          }

          .form-group input,
          .submit-btn {
            font-size: 0.9rem;
            padding: 0.8rem 1rem;
          }
        }
      `}</style>

      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p className="toggle-auth">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" onClick={toggleAuthMode} disabled={loading}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;