import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const { register, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(username, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Создание Гримуара</h1>
        <p className="register-subtitle">Создайте свою учетную запись для доступа к магии продуктивности</p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
              placeholder="Ваше магическое имя"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Электронная почта</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading || authLoading}
          >
            {loading || authLoading ? 'Создание...' : 'Создать Гримуар'}
          </button>
        </form>

        <div className="register-footer">
          <p>Уже есть учетная запись? <span className="link" onClick={() => navigate('/login')}>Войти</span></p>
        </div>
      </div>
    </div>
  );
};

export default Register;