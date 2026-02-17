const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 4000; // Fisso in locale
const BACKEND_URL = 'https://modproject-production.up.railway.app';

// Middleware
app.use(cors());
app.use(express.json());

// Log richieste
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ✅ API Routes
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

// ❌ RIMUOVI express.static e app.get('*')!

app.listen(PORT, () => {
  console.log(`🚀 Proxy server on port ${PORT}`);
  console.log(`🔗 Backend: ${BACKEND_URL}`);
});
