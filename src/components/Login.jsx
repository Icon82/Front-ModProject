import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    console.log('🔍 === LOGIN DEBUG START ===');
    console.log('📧 Username:', credentials.username);
    console.log('🔑 Password:', credentials.password);
    
    if (!credentials.username || !credentials.password) {
      setError('Inserisci username e password');
      console.log('❌ Username o password vuoti');
      return;
    }
  
    setLoading(true);
  
    // ⚠️ REPLICA ESATTA DEL cURL DI SWAGGER
    const requestBody = JSON.stringify({
      username: credentials.username,
      password: credentials.password
    });
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'accept': '*/*',                    // ← identico a Swagger
        'Content-Type': 'application/json'  // ← identico a Swagger
      },
      body: requestBody
    };
  
    console.log('📤 === RICHIESTA API (identica a Swagger) ===');
    console.log('🌐 URL completo:', 'https://modproject-production.up.railway.app/auth/login');
    console.log('🌐 URL proxy:', '/auth/login');
    console.log('📋 Method:', requestOptions.method);
    console.log('📄 Headers:', requestOptions.headers);
    console.log('📦 Body:', requestBody);
    console.log('================');
  
    try {
      // Usa /auth/login se hai il proxy, altrimenti URL completo
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      //const response = await fetch(`${API_URL}/auth/login`, requestOptions);
      const response = await fetch('/auth/login', requestOptions);
     
      console.log('📥 === RISPOSTA API ===');
      console.log('📊 Status:', response.status);
      console.log('📊 StatusText:', response.statusText);
      console.log('📊 OK:', response.ok);
      console.log('📄 Headers risposta:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('📄 Response text:', responseText);
      
      let data;
      if (response.ok) {
        data = JSON.parse(responseText);
        console.log('✅ === LOGIN SUCCESS ===');
        console.log('🔑 Token:', data.token ? data.token.substring(0, 30) + '...' : 'N/A');
        console.log('👥 Roles:', data.roles);
        console.log('📅 Expire:', data.expireDate);
        console.log('🔢 Permessi:', data.permessi);
        console.log('================');
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('roles', JSON.stringify(data.roles));
        localStorage.setItem('expireDate', data.expireDate);
        localStorage.setItem('permessi', data.permessi);
        localStorage.setItem('username', credentials.username);
  
        onLoginSuccess(data);
      } else {
        try {
          data = JSON.parse(responseText);
          console.log('❌ Errore API (JSON):', data);
          throw new Error(data.message || `HTTP ${response.status}`);
        } catch (e) {
          console.log('❌ Response non JSON:', responseText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
    } catch (err) {
      console.log('💥 === ERRORE COMPLETO ===');
      console.log('Tipo errore:', err.name);
      console.log('Messaggio:', err.message);
      console.log('Stack:', err.stack);
      console.log('================');
      
      setError(err.message || 'Errore durante il login');
    } finally {
      setLoading(false);
      console.log('🔍 === LOGIN DEBUG END ===\n\n');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Gestione Progetti</h1>
          <p>Accedi al tuo account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="Inserisci il tuo username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Inserisci la tua password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;