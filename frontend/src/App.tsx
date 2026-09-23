import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEventsStore } from './store/eventsStore';
import { useNotesStore } from './store/notesStore';
import { useHabitsStore } from './store/habitsStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventsPage from './pages/EventsPage';
import NotesPage from './pages/NotesPage';
import HabitsPage from './pages/HabitsPage';
import ProfilePage from './pages/ProfilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, loading: authLoading } = useAuthStore();
  const { events, loading: eventsLoading } = useEventsStore();
  const { notes, loading: notesLoading } = useNotesStore();
  const { habits, loading: habitsLoading } = useHabitsStore();

  // Check auth status
  const isAuthenticated = !!user;

  // Redirect if not authenticated (except for login/register pages)
  // This is handled in individual route components

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/events"
            element={isAuthenticated ? <EventsPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/notes"
            element={isAuthenticated ? <NotesPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/habits"
            element={isAuthenticated ? <HabitsPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose=3000
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;