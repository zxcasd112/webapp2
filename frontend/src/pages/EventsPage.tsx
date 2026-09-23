import React, { useState, useEffect } from 'react';
import { useEventsStore } from '../store/eventsStore';
import AddEventModal from '../components/AddEventModal';
import './EventsPage.css';

const EventsPage: React.FC = () => {
  const { events, loading, fetchEvents, addEvent, updateEvent, deleteEvent, toggleComplete } = useEventsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter(event => {
    if (filter === 'completed') return event.completed;
    if (filter === 'pending') return !event.completed;
    return true;
  });

  const handleAddEvent = () => {
    setEditEventId(null);
    setModalOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setEditEventId(event.id);
    setModalOpen(true);
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот квест? Это действие нельзя отменить.')) {
      try {
        await deleteEvent(id);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await toggleComplete(id);
    } catch (error) {
      console.error('Failed to toggle event completion:', error);
    }
  };

  if (loading) {
    return (
      <div className="events-page-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка квестов из гримуара...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <header className="events-header">
        <h1>Квест-лог</h1>
        <p className="page-subtitle">Ваши текущие и предстоящие магические задания</p>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleAddEvent}>
            Добавить квест
          </button>
        </div>
      </header>

      <div className="events-filters">
        <button
          className={filter === 'all' ? 'btn-filter active' : 'btn-filter'}
          onClick={() => setFilter('all')}
        >
          Все квесты
        </button>
        <button
          className={filter === 'pending' ? 'btn-filter active' : 'btn-filter'}
          onClick={() => setFilter('pending')}
        >
          Активные
        </button>
        <button
          className={filter === 'completed' ? 'btn-filter active' : 'btn-filter'}
          onClick={() => setFilter('completed')}
        >
          Выполненные
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="events-empty">
          <div className="empty-icon">📜</div>
          <h2>Квестов пока нет</h2>
          <p>Создайте свой первый квест, чтобы начать путь mastery</p>
          <button className="btn btn-primary" onClick={handleAddEvent}>
            Создать первый квест
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div key={event.id} className={`event-card ${event.completed ? 'completed' : ''}`}>
              <div className="event-header">
                <div className="event-meta">
                  <span className="event-icon">{event.icon || '🎯'}</span>
                  {event.date && (
                    <span className="event-date">
                      {new Date(event.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                  {event.type && (
                    <span className={`event-tag ${event.type.toLowerCase()}`}>
                      {event.type}
                    </span>
                  )}
                  {event.isRecurring && (
                    <span className="event-tag recurring">Повторяющийся</span>
                  )}
                </div>
                <div className="event-actions">
                  <button
                    className="btn btn-icon"
                    onClick={() => handleEditEvent(event)}
                    title="Редактировать квест"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-icon"
                    onClick={() => handleDeleteEvent(event.id)}
                    title="Удалить квест"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="event-title">
                <h3>{event.title}</h3>
              </div>

              {event.description && (
                <div className="event-description">
                  {event.description}
                </div>
              )}

              <div className="event-footer">
                <button
                  className={`btn btn-${event.completed ? 'outline' : 'success'} btn-block`}
                  onClick={() => handleToggleComplete(event.id)}
                >
                  {event.completed ? 'Отметить как незавершенное' : 'Отметить как выполненное'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Event Modal */}
      <div className={`modal ${modalOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>{editEventId ? 'Редактировать квест' : 'Создать новый квест'}</h2>
            <button
              className="btn btn-close"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
          </div>
          <AddEventModal
            eventId={editEventId}
            onClose={() => setModalOpen(false)}
            onSave={async (eventData) => {
              if (editEventId) {
                await updateEvent(editEventId, eventData);
              } else {
                await addEvent(eventData);
              }
              setModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;