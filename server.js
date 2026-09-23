// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, 'frontend', 'build');

  // Check if frontend build exists
  const fs = require('fs');
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

    // Still serve all API routes normally
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
  }
}