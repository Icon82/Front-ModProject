// proxy-server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;

// Backend Railway URL
const BACKEND_URL = process.env.BACKEND_URL || 'https://modproject-production.up.railway.app';

// Middleware
app.use(cors({
  origin: '*', // In produzione specifica il tuo dominio
  credentials: true
}));
app.use(express.json());

// Log delle richieste
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Route di test
app.get('/', (req, res) => {
  res.json({ 
    status: 'Proxy Server Running',
    backend: BACKEND_URL,
    port: PORT
  });
});

// Proxy per login
app.post('/auth/login', async (req, res) => {
  try {
    console.log('📤 Proxy richiesta login:', req.body);

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

    console.log('✅ Login success:', response.status);
    res.json(response.data);

  } catch (error) {
    console.log('❌ Login error:', error.response?.status, error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Proxy generico per tutte le altre chiamate API
app.use('/api/*', async (req, res) => {
  try {
    const path = req.originalUrl.replace('/api', '');
    const url = `${BACKEND_URL}${path}`;

    console.log(`📤 Proxy ${req.method} ${url}`);

    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: {
        ...req.headers,
        host: undefined,
        'Content-Type': 'application/json'
      }
    });

    res.status(response.status).json(response.data);

  } catch (error) {
    console.log('❌ API error:', error.response?.status, error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`🔗 Backend: ${BACKEND_URL}`);
  console.log(`📡 CORS enabled for all origins`);
});