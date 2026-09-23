import { create } from 'zustand';
import axios from 'axios';

interface AuthState {
  user: {
    id: number;
    username: string;
    email: string;
  } | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
    } catch (error: any) {
      set({ loading: false });
      throw error.response?.data?.error || 'Login failed';
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ loading: true });
    try {
      const response = await axios.post('/api/register', { username, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
    } catch (error: any) {
      set({ loading: false });
      throw error.response?.data?.error || 'Registration failed';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    set({ loading: true });
    try {
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data.user, loading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  }
}));