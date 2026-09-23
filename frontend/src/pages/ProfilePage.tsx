import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user, logout, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would call an API to change password
      // For now, we'll simulate success
      setSuccess('Пароль успешно изменен');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Профиль магу</h1>
        <p className="page-subtitle">Управление вашей учетной записью и настройками</p>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <h2>Информация о учетной записи</h2>
          {user && (
            <>
              <div className="profile-info">
                <div className="info-item">
                  <span className="info-label">Имя пользователя:</span>
                  <span className="info-value">{user.username}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Электронная почта:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">ID учетной записи:</span>
                  <span className="info-value">#{user.id}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="profile-card">
          <h2>Безопасность</h2>
          <form onSubmit={handleChangePassword} className="security-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Текущий пароль</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Новый пароль</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="form-input"
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Подтверждение нового пароля</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Изменение...' : 'Изменить пароль'}
            </button>
          </form>
        </div>

        <div className="profile-card">
          <h2>Сессия</h2>
          <button
            className="btn btn-danger btn-block"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Выход...' : 'Выйти из учетной записи'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;