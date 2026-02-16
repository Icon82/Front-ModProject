import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [userData, setUserData] = useState({
    username: '',
    roles: [],
    permessi: 0
  });

  useEffect(() => {
    const username = localStorage.getItem('username');
    const roles = authService.getUserRoles();
    const permessi = authService.getPermessi();

    setUserData({ username, roles, permessi });
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Gestione Progetti</h1>
          <div className="user-info">
            <span className="username">
              <strong>{userData.username}</strong>
            </span>
            <button onClick={onLogout} className="logout-button">
              Esci
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Benvenuto nel sistema di gestione progetti</h2>
          <p>Sei autenticato correttamente</p>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <h3>Ruoli Assegnati</h3>
            <div className="roles-list">
              {userData.roles.map(role => (
                <div key={role.id} className="role-badge">
                  <span className="role-name">{role.name}</span>
                  <span className="role-description">{role.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card">
            <h3>Permessi</h3>
            <div className="permessi-value">{userData.permessi}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;