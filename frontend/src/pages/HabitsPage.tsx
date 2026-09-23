import React, { useState, useEffect } from 'react';
import { useHabitsStore } from '../store/habitsStore';
import { useAuthStore } from '../store/authStore';
import AddHabitModal from '../components/AddHabitModal';
import './HabitsPage.css';

const HabitsPage: React.FC = () => {
  const { habits, habitTracking, loading, fetchHabits, addHabit, updateHabit, deleteHabit, toggleHabit, fetchHabitTracking } = useHabitsStore();
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editHabitId, setEditHabitId] = useState<number | null>(null);
  const [selectedHabitForTracking, setSelectedHabitForTracking] = useState<number | null>(null);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleAddHabit = () => {
    setEditHabitId(null);
    setModalOpen(true);
  };

  const handleEditHabit = (habit: any) => {
    setEditHabitId(habit.id);
    setModalOpen(true);
  };

  const handleDeleteHabit = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту привычку? Это действие нельзя отменить.')) {
      try {
        await deleteHabit(id);
      } catch (error) {
        console.error('Failed to delete habit:', error);
      }
    }
  };

  const handleToggleHabit = async (habitId: number, date: string) => {
    try {
      await toggleHabit(habitId, date);
    } catch (error) {
      console.error('Failed to toggle habit:', error);
    }
  };

  const handleSelectHabitForTracking = (habitId: number) => {
    setSelectedHabitForTracking(habitId);
    fetchHabitTracking(habitId);
  };

  if (loading) {
    return (
      <div className="habits-page-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка пути адепта...</p>
      </div>
    );
  }

  return (
    <div className="habits-page">
      <header className="habits-header">
        <h1>Путь адепта</h1>
        <p className="page-subtitle">Развивайте свои магические способности через ежедневные практики</p>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleAddHabit}>
            Добавить привычку
          </button>
        </div>
      </header>

      {/* Habit Tracking Section */}
      {selectedHabitForTracking !== null && (
        <div className="habit-tracking-section">
          <div className="tracking-header">
            <h2>Отслеживание привычки</h2>
            <button
              className="btn btn-outline btn-back"
              onClick={() => setSelectedHabitForTracking(null)}
            >
              ← Назад к списку привычек
            </button>
          </div>

          {/* Habit details would go here - simplified for now */}
          <div className="tracking-info">
            <h3>{habits.find(h => h.id === selectedHabitForTracking)?.name || 'Привычка'}</h3>
            <p className="tracking-description">
              {habits.find(h => h.id === selectedHabitForTracking)?.description || ''}
            </p>
          </div>

          {/* Calendar view for tracking - simplified */}
          <div className="tracking-calendar">
            <div className="calendar-header">
              <div className="weekday">Пн</div>
              <div className="weekday">Вт</div>
              <div className="weekday">Ср</div>
              <div className="weekday">Чт</div>
              <div className="weekday">Пт</div>
              <div className="weekday">Сб</div>
              <div className="weekday">Вс</div>
            </div>
            {/* Days of the month - placeholder */}
            {[...Array(30)].map((_, index) => (
              <div key={index} className="calendar-day">
                <div className="day-number">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedHabitForTracking && (
        <>
          <section className="habits-section">
            <h2>Ваши привычки</h2>
            {habits.length === 0 ? (
              <div className="habits-empty">
                <div className="empty-icon">🌱</div>
                <h3>Привычек пока нет</h3>
                <p>Начните развивать свои магические способности с малого</p>
                <button className="btn btn-primary" onClick={handleAddHabit}>
                  Создать первую привычку
                </button>
              </div>
            ) : (
              <div className="habits-grid">
                {habits.map(habit => (
                  <div key={habit.id} className="habit-card">
                    <div className="habit-header">
                      <h3>{habit.name}</h3>
                      <span className="habit-frequency">{habit.frequency}</span>
                    </div>
                    <p className="habit-description">{habit.description || ''}</p>

                    {/* Simplified progress - in reality would come from tracking data */}
                    <div className="habit-progress">
                      <div className="progress-label">Среднее выполнение</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '65%' }}></div>
                      </div>
                      <span className="progress-text">65%</span>
                    </div>

                    <div className="habit-actions">
                      <button
                        className="btn btn-icon"
                        onClick={() => handleEditHabit(habit)}
                        title="Редактировать привычку"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-icon"
                        onClick={() => handleDeleteHabit(habit.id)}
                        title="Удалить привычку"
                      >
                        🗑️
                      </button>
                      <button
                        className="btn btn-icon habit-track-btn"
                        onClick={() => handleSelectHabitForTracking(habit.id)}
                        title="Отслеживать выполнение"
                      >
                        📊
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="btn btn-secondary btn-block" onClick={handleAddHabit}>
              Добавить новую привычку
            </button>
          </section>
        </>
      )}

      {/* Add/Edit Habit Modal */}
      <div className={`modal ${modalOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>{editHabitId ? 'Редактировать привычку' : 'Создать новую привычку'}</h2>
            <button
              className="btn btn-close"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
          </div>
          <AddHabitModal
            habitId={editHabitId}
            onClose={() => setModalOpen(false)}
            onSave={async (habitData) => {
              if (editHabitId) {
                await updateHabit(editHabitId, habitData);
              } else {
                await addHabit(habitData);
              }
              setModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;