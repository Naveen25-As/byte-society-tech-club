/**
 * Byte Society — Full-Stack Server (Steps 5 & 6)
 *
 * Express API + serves the Windsurf frontend from one port.
 */

require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const registrationRoutes = require('./routes/registrations');
const contactRoutes = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// CORS still useful if you open frontend via Live Server during development
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501',
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
  ],
}));

app.use(express.json());

// --- API routes (must come before static files) ---
app.use('/api/registrations', registrationRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: 'ok',
    message: 'Byte Society backend is running',
    database: dbStatusMap[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// --- Serve frontend static files (HTML, CSS, JS) ---
const frontendPath = path.join(__dirname, '..', 'windsurf');
app.use(express.static(frontendPath));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Website:  http://localhost:${PORT}/`);
  console.log(`API:      http://localhost:${PORT}/api/health`);
});
