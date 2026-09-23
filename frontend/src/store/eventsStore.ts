import { create } from 'zustand';
import axios from 'axios';

interface Event {
  id: number;
  title: string;
  description?: string;
  date?: string;
  type?: string;
  color?: string;
  icon?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EventsState {
  events: Event[];
  loading: boolean;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: number, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  loading: false,

  fetchEvents: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ events: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch events:', error);
    }
  },

  addEvent: async (eventData) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/events', eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ events: [...get().events, response.data], loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateEvent: async (id, eventData) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/events/${id}`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        events: get().events.map(event =>
          event.id === id ? response.data : event
        ),
        loading: false
      });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        events: get().events.filter(event => event.id !== id),
        loading: false
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  toggleComplete: async (id) => {
    const event = get().events.find(e => e.id === id);
    if (!event) return;

    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/events/${id}`, {
        completed: !event.completed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        events: get().events.map(event =>
          event.id === id ? response.data : event
        ),
        loading: false
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));