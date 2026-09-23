import React, { useState } from 'react';
import './AddNoteModal.css';

interface AddNoteModalProps {
  noteId: number | null;
  onClose: () => void;
  onSave: (noteData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ noteId, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If editing, we would fetch the note data here
    // For now, we'll leave fields empty for add/edit
  }, [noteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!title.trim()) {
      setError('Пожалуйста, введите название записи');
      setLoading(false);
      return;
    }

    try {
      await onSave({
        title,
        content: content || undefined,
        tags: tags.length > 0 ? tags : undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags.tags.filter(tag => tag !== tagToRemove);
  };

  return (
    <div className="add-note-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{noteId ? 'Редактировать запись' : 'Создать новую запись'}</h2>
            <button className="btn btn-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="note-form">
            <div className="form-group">
              <label htmlFor="note-title">Название записи *</label>
              <input
                type="text"
                id="note-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-input"
                placeholder="Например: Наблюдения о лунной магии..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="note-content">Содержание записи</label>
              <textarea
                id="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="8"
                className="form-input"
                placeholder="Подробные наблюдения, идеи, формулы, сны, пророчества..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Теги (опционально)</label>
              <div className="tags-input">
                <form onSubmit={handleAddTag} className="tag-form">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Добавить тег..."
                    className="tag-input"
                  />
                  <button type="submit" className="btn btn-outline btn-sm">
                    Добавить
                  </button>
                </form>
                {tags.length > 0 && (
                  <div className="tag-list">
                    {tags.map((tag, index) => (
                      <div key={index} className="tag-item">
                        <span className="tag">#{tag}</span>
                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="help-text">Теги помогут вам организовать и быстро находить записи по темам</p>
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
                {loading ? 'Сохранение...' : noteId ? 'Сохранить изменения' : 'Создать запись'}
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

export default AddNoteModal;