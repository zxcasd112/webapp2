import { create } from 'zustand';
import axios from 'axios';

interface Note {
  id: number;
  title: string;
  content?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  fetchNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: number, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,

  fetchNotes: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ notes: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch notes:', error);
    }
  },

  addNote: async (noteData) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/notes', noteData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ notes: [...get().notes, response.data], loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateNote: async (id, noteData) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/notes/${id}`, noteData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        notes: get().notes.map(note =>
          note.id === id ? response.data : note
        ),
        loading: false
      });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteNote: async (id) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        notes: get().notes.filter(note => note.id !== id),
        loading: false
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));