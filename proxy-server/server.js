const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const BACKEND_URL = process.env.BACKEND_URL || 'https://modproject-production.up.railway.app';

// Middleware
app.use(cors());
app.use(express.json());

// Log richieste
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ⚠️ API Routes PRIMA di static files
app.post('/auth/login', async (req, res) => {
  try {
    console.log('📤 Proxy login:', req.body);
    
    const response = await axios.post(
      `${BACKEND_URL}/auth/login`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      }
    );
    
    console.log('✅ Login success');
    res.json(response.data);
    
  } catch (error) {
    console.log('❌ Login error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Proxy generico per altre API
app.use('/api/*', async (req, res) => {
  try {
    const path = req.originalUrl.replace('/api', '');
    const url = `${BACKEND_URL}${path}`;
    
    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: {
        ...req.headers,
        host: undefined
      }
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message
    });
  }
});

// ⚠️ Serve React build (DOPO le API routes!)
app.use(express.static(path.join(__dirname, '../build')));

// ⚠️ Tutte le altre route tornano index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Backend: ${BACKEND_URL}`);
  console.log(`📦 Serving React from: ${path.join(__dirname, '../build')}`);
});
