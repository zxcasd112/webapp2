import React, { useState } from 'react';
import './AddHabitModal.css';

interface AddHabitModalProps {
  habitId: number | null;
  onClose: () => void;
  onSave: (habitData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ habitId, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [triggerText, setTriggerText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If editing, we would fetch the habit data here
    // For now, we'll leave fields empty for add/edit
  }, [habitId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name.trim()) {
      setError('Пожалуйста, введите название привычки');
      setLoading(false);
      return;
    }

    try {
      await onSave({
        name,
        description,
        frequency,
        triggerText: triggerText || undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save habit');
    } finally {
      setLoading(false);
    }
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Ежедневно' },
    { value: 'weekly', label: 'Еженедельно' },
    { value: 'monthly', label: 'Ежемесячно' },
    { value: 'custom', label: 'Пользовательский' }
  ];

  return (
    <div className="add-habit-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{habitId ? 'Редактировать привычку' : 'Создать новую привычку'}</h2>
            <button className="btn btn-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="habit-form">
            <div className="form-group">
              <label htmlFor="habit-name">Название привычки *</label>
              <input
                type="text"
                id="habit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
                placeholder="Например: Медитировать при свече луны..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-description">Описание привычки (опционально)</label>
              <textarea
                id="habit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="form-input"
                placeholder="Подробное описание привычки, ее цели и преимуществ..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-frequency">Частота выполнения</label>
              <select
                id="habit-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="form-select"
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {frequency === 'custom' && (
              <div className="form-group">
                <label htmlFor="custom-frequency">Пользовательская частота</label>
                <input
                  type="text"
                  id="custom-frequency"
                  placeholder="Например: каждые 2 дня, по понедельникам и пятницам, после каждой тренировки"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="habit-trigger">Триггер привычки (опционально)</label>
              <input
                type="text"
                id="habit-trigger"
                value={triggerText}
                onChange={(e) => setTriggerText(e.target.value)}
                className="form-input"
                placeholder="Например: После вечерней молитвы, При восходе солнца, После завершения работы..."
              />
            </div>

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
                {loading ? 'Сохранение...' : habitId ? 'Сохранить изменения' : 'Создать привычку'}
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

export default AddHabitModal;