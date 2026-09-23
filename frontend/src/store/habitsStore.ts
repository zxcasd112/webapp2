import { create } from 'zustand';
import axios from 'axios';

interface Habit {
  id: number;
  name: string;
  description?: string;
  frequency?: string;
  triggerText?: string;
  createdAt: string;
  updatedAt: string;
}

interface HabitTracking {
  id: number;
  habitId: number;
  date: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
  createdAt: string;
}

interface HabitsState {
  habits: Habit[];
  habitTracking: HabitTracking[];
  loading: boolean;
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHabit: (id: number, habit: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  toggleHabit: (habitId: number, date: string) => Promise<void>;
  fetchHabitTracking: (habitId: number) => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  habitTracking: [],
  loading: false,

  fetchHabits: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/habits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ habits: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch habits:', error);
    }
  },

  addHabit: async (habitData) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/habits', habitData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ habits: [...get().habits, response.data], loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateHabit: async (id, habitData) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/habits/${id}`, habitData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        habits: get().habits.map(habit =>
          habit.id === id ? response.data : habit
        ),
        loading: false
      });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteHabit: async (id) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        habits: get().habits.filter(habit => habit.id !== id),
        loading: false
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  toggleHabit: async (habitId, date) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      // Check if tracking entry exists for this date
      const existing = get().habitTracking.find(
        t => t.habitId === habitId && t.date === date
      );

      if (existing) {
        // Toggle existing entry
        const response = await axios.put(`/api/habit-tracking/${existing.id}`, {
          completed: !existing.completed
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        set({
          habitTracking: get().habitTracking.map(t =>
            t.id === existing.id ? response.data : t
          ),
          loading: false
        });
      } else {
        // Create new tracking entry
        const response = await axios.post('/api/habit-tracking', {
          habitId,
          date,
          completed: true
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        set({
          habitTracking: [...get().habitTracking, response.data],
          loading: false
        });
      }
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchHabitTracking: async (habitId) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/habits/${habitId}/tracking`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ habitTracking: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch habit tracking:', error);
    }
  }
}));