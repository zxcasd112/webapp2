import React, { useState, useEffect } from 'react';
import { useNotesStore } from '../store/notesStore';
import { useAuthStore } from '../store/authStore';
import AddNoteModal from '../components/AddNoteModal';
import './NotesPage.css';

const NotesPage: React.FC = () => {
  const { notes, loading, fetchNotes, addNote, updateNote, deleteNote } = useNotesStore();
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editNoteId, setEditNoteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddNote = () => {
    setEditNoteId(null);
    setModalOpen(true);
  };

  const handleEditNote = (note: any) => {
    setEditNoteId(note.id);
    setModalOpen(true);
  };

  const handleDeleteNote = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить.')) {
      try {
        await deleteNote(id);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="notes-page-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка записей из гримуара...</p>
      </div>
    );
  }

  return (
    <div className="notes-page">
      <header className="notes-header">
        <h1>Гримуар магу</h1>
        <p className="page-subtitle">Ваши записи, наблюдения и магические формулы</p>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleAddNote}>
            Добавить запись
          </button>
        </div>
      </header>

      <div className="notes-search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по записям..."
          className="search-input"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="notes-empty">
          <div className="empty-icon">📖</div>
          <h2>Записей пока нет</h2>
          <p>Начните вести свой гримуар, записывая наблюдения и идеи</p>
          <button className="btn btn-primary" onClick={handleAddNote}>
            Создать первую запись
          </button>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <div className="note-meta">
                  <span className="note-date">
                    {new Date(note.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  {note.tags && note.tags.length > 0 && (
                    <div className="note-tags">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {note.content && (
                <div className="note-content">
                  {note.content.length > 200 ?
                    note.content.substring(0, 200) + '...' :
                    note.content
                  }
                </div>
              )}

              <div className="note-actions">
                <button
                  className="btn btn-icon"
                  onClick={() => handleEditNote(note)}
                  title="Редактировать запись"
                >
                  ✏️
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => handleDeleteNote(note.id)}
                  title="Удалить запись"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Note Modal */}
      <div className={`modal ${modalOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>{editNoteId ? 'Редактировать запись' : 'Создать новую запись'}</h2>
            <button
              className="btn btn-close"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
          </div>
          <AddNoteModal
            noteId={editNoteId}
            onClose={() => setModalOpen(false)}
            onSave={async (noteData) => {
              if (editNoteId) {
                await updateNote(editNoteId, noteData);
              } else {
                await addNote(noteData);
              }
              setModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotesPage;