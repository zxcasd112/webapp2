import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useEventsStore } from '../store/eventsStore';
import { useNotesStore } from '../store/notesStore';
import { useHabitsStore } from '../store/habitsStore';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { events, loading: eventsLoading } = useEventsStore();
  const { notes, loading: notesLoading } = useNotesStore();
  const { habits, loading: habitsLoading } = useHabitsStore();

  useEffect(() => {
    // Fetch data when user is available
    if (user) {
      // These will be called from the stores' initialization or we can call them here
      // For now, we'll assume the stores fetch data on mount
    }
  }, [user]);

  // Get upcoming events (today and future)
  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = events
    .filter(event => !event.completed && (!event.date || event.date >= today))
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : Infinity;
      const dateB = b.date ? new Date(b.date).getTime() : Infinity;
      return dateA - dateB;
    })
    .slice(0, 5);

  // Get recent notes
  const recentNotes = notes.slice(0, 3);

  // Get habit stats
  const habitStats = habits.map(habit => {
    // This would normally come from tracking data
    return {
      ...habit,
      completionRate: Math.floor(Math.random() * 100) // Placeholder
    };
  });

  if (eventsLoading || notesLoading || habitsLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка магии продуктивности...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Пристанище Мага</h1>
        <p className="user-greeting">Добро пожаловать, {user?.username}</p>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{upcomingEvents.length}</h3>
            <p>Ближайших квестов</p>
          </div>
          <div className="stat-card">
            <h3>{notes.length}</h3>
            <p>Записей в гримуаре</p>
          </div>
          <div className="stat-card">
            <h3>{habits.length}</h3>
            <p>Активных привычек</p>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-section">
          <h2>Ближайшие квесты</h2>
          {upcomingEvents.length === 0 ? (
            <p className="empty-state">Нет предстоящих квестов. Создайте свой первый квест!</p>
          ) : (
            <div className="events-list">
              {upcomingEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-icon">{event.icon || '🎯'}</div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <p className="event-date">
                      {event.date ? new Date(event.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short'
                      }) : 'Дата не указана'}
                    </p>
                    {event.type && (
                      <span className={`event-type ${event.type.toLowerCase()}`}>
                        {event.type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-secondary" onClick={() => window.location.href = '/events'}>
            Показать все квесты
          </button>
        </section>

        <section className="dashboard-section">
          <h2>Недавние записи в гримуаре</h2>
          {recentNotes.length === 0 ? (
            <p className="empty-state">Записей пока нет. Начните вести свой гримуар!</p>
          ) : (
            <div className="notes-list">
              {recentNotes.map(note => (
                <div key={note.id} className="note-card">
                  <h3>{note.title}</h3>
                  <p className="note-preview">
                    {note.content ? note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '') : ''}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="note-tags">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-secondary" onClick={() => window.location.href = '/notes'}>
            Показать все записи
          </button>
        </section>

        <section className="dashboard-section">
          <h2>Путь адепта</h2>
          {habits.length === 0 ? (
            <p className="empty-state">Привычек пока нет. Начните развивать свои магические способности!</p>
          ) : (
            <div className="habits-list">
              {habits.map(habit => (
                <div key={habit.id} className="habit-card">
                  <div className="habit-header">
                    <h3>{habit.name}</h3>
                    <span className="habit-frequency">{habit.frequency}</span>
                  </div>
                  <p className="habit-description">{habit.description || ''}</p>
                  <div className="habit-progress">
                    <div className="progress-label">Выполнение</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${habit.completionRate}%` }}></div>
                    </div>
                    <span className="progress-text">{habit.completionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-secondary" onClick={() => window.location.href = '/habits'}>
            Управлять привычками
          </button>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>Продолжайте свой путь mastery. Каждый маленький квест ведет к великим свершениям.</p>
      </footer>
    </div>
  );
};

export default Dashboard;