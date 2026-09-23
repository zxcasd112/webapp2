import React, { useState, useEffect } from 'react';
import './AddEventModal.css';

interface AddEventModalProps {
  eventId: number | null;
  onClose: () => void;
  onSave: (eventData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ eventId, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('personal');
  const [color, setColor] = useState('#ff6b6b');
  const [icon, setIcon] = useState('🎯');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If editing, we would fetch the event data here
    // For now, we'll leave fields empty for add/edit
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!title.trim()) {
      setError('Пожалуйста, введите название квеста');
      setLoading(false);
      return;
    }

    try {
      await onSave({
        title,
        description,
        date: date || undefined,
        type,
        color,
        icon,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = [
    '🎯', '💼', '❤️', '📚', '💪', '🎉', '✈️', '💰', '🔮', '🧙‍♂️',
    '⚔️', '🛡️', '🧪', '🌿', '🔥', '💧', '🌍', '💨', '👁️', '👂'
  ];

  const typeOptions = [
    { value: 'personal', label: 'Личное' },
    { value: 'work', label: 'Работа' },
    { value: 'health', label: 'Здоровье' },
    { value: 'learning', label: 'Обучение' },
    { value: 'spiritual', label: 'Духовное' },
    { value: 'creative', label: 'Творческое' },
    { value: 'social', label: 'Социальное' },
    { value: 'financial', label: 'Финансовое' }
  ];

  return (
    <div className="add-event-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{eventId ? 'Редактировать квест' : 'Создать новый квест'}</h2>
            <button className="btn btn-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-group">
              <label htmlFor="event-title">Название квеста *</label>
              <input
                type="text"
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-input"
                placeholder="Например: Очистить оскверненный храм..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-description">Описание (опционально)</label>
              <textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="form-input"
                placeholder="Подробные детали квеста, необходимые компоненты, предупреждения..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-date">Дата и время квеста</label>
              <input
                type="datetime-local"
                id="event-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-type">Тип квеста</label>
              <select
                id="event-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-select"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="event-color">Цвет квеста</label>
              <input
                type="color"
                id="event-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="form-input color-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-icon">Иконка квеста</label>
              <div className="icon-picker">
                {iconOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`icon-btn ${option === icon ? 'active' : ''}`}
                    onClick={() => setIcon(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="is-recurring">
                <input
                  type="checkbox"
                  id="is-recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                Повторяющийся квест
              </label>
            </div>

            {isRecurring && (
              <div className="form-group">
                <label htmlFor="recurrence-pattern">Паттерн повторения</label>
                <input
                  type="text"
                  id="recurrence-pattern"
                  value={recurrencePattern}
                  onChange={(e) => setRecurrencePattern(e.target.value)}
                  className="form-input"
                  placeholder="Например: after completion every 3 days, every full moon, etc."
                />
                <p className="help-text">Опишите, когда должен создаваться новый квест после завершения текущего</p>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Сохранение...' : eventId ? 'Сохранить изменения' : 'Создать квест'}
              </button>
            </div>
          </form>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;