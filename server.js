const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create schema on startup so a fresh database works without manual init.sql
const initDatabase = async () => {
  const schemaPath = path.join(__dirname, 'init.sql');
  if (!fs.existsSync(schemaPath)) {
    console.warn('init.sql not found, skipping schema init');
    return;
  }
  const schema = fs.readFileSync(schemaPath, 'utf8');
  try {
    await pool.query(schema);
    console.log('Database schema is ready');
  } catch (err) {
    console.error('Schema init failed:', err.code, '-', err.message);
    console.error(err.stack);
  }
};

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('POST /api/login failed:', err.code, '-', err.message);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('POST /api/register failed:', err.code, '-', err.message);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Events routes
app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE user_id = $1 ORDER BY created_at DESC', [req.user.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  const { title, description, date, type, color, icon, isRecurring, recurrencePattern } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (user_id, title, description, date, type, color, icon, is_recurring, recurrence_pattern) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [req.user.userId, title, description, date, type, color, icon, isRecurring, recurrencePattern]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, date, type, color, icon, isRecurring, recurrencePattern } = req.body;
  try {
    const result = await pool.query(
      'UPDATE events SET title = $1, description = $2, date = $3, type = $4, color = $5, icon = $6, is_recurring = $7, recurrence_pattern = $8, updated_at = NOW() WHERE id = $9 AND user_id = $10 RETURNING *',
      [title, description, date, type, color, icon, isRecurring, recurrencePattern, id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Habits routes
app.get('/api/habits', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC', [req.user.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/habits', authenticateToken, async (req, res) => {
  const { name, description, frequency, triggerText } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO habits (user_id, name, description, frequency, trigger_text) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.userId, name, description, frequency, triggerText]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/habits/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, frequency, triggerText } = req.body;
  try {
    const result = await pool.query(
      'UPDATE habits SET name = $1, description = $2, frequency = $3, trigger_text = $4, updated_at = NOW() WHERE id = $5 AND user_id = $6 RETURNING *',
      [name, description, frequency, triggerText, id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/habits/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/habit-tracking', authenticateToken, async (req, res) => {
  const { habitId, date, completed } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO habit_tracking (habit_id, date, completed) VALUES ($1, $2, $3) RETURNING *',
      [habitId, date, completed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/habit-tracking/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const result = await pool.query(
      'UPDATE habit_tracking SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit tracking not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/habits/:habitId/tracking', authenticateToken, async (req, res) => {
  const { habitId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM habit_tracking WHERE habit_id = $1 ORDER BY date DESC',
      [habitId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Notes routes
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC', [req.user.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/notes', authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO notes (user_id, title, content, tags) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, title, content, tags]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/notes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  try {
    const result = await pool.query(
      'UPDATE notes SET title = $1, content = $2, tags = $3, updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, content, tags, id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, 'frontend', 'build');

  // Check if frontend build exists
  if (fs.existsSync(frontendBuildPath) && fs.existsSync(path.join(frontendBuildPath, 'index.html'))) {
    app.use(express.static(frontendBuildPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
  } else {
    // Log warning but don't crash - serve API only
    console.warn('WARNING: Frontend build not found in', frontendBuildPath);
    console.warn('Serving API only. To serve frontend, run: cd frontend && npm run build');

    // Serve API info on root path
    app.get('/', (req, res) => {
      res.json({
        message: 'TaskMaster Fantasy API is running',
        status: 'API only - frontend not built',
        timestamp: new Date().toISOString()
      });
    });
  }
} else {
  // Development route
  app.get('/', (req, res) => {
    res.json({
      message: 'TaskMaster Fantasy API is running in development mode',
      status: 'Development',
      timestamp: new Date().toISOString()
    });
  });
}

// Health check route
app.get('/health', async (req, res) => {
  try {
    // Verify database connection
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection failed'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  initDatabase();
});