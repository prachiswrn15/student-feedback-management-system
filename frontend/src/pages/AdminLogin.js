import React, { useState } from 'react';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = ({ onLogin, switchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    console.log("Trying login with:", { trimmedUsername, trimmedPassword }); // ✅ Debug

    try {
      await axios.post('http://localhost:5000/api/admin/login', {
        username: trimmedUsername,
        password: trimmedPassword
      });

      localStorage.setItem('isAdmin', 'true');
      onLogin();
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <h2>🔐 Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈 Hide' : '👁 Show'}
            </span>
          </div>
          <button type="submit" className="login-button">🔓 Login</button>
          <p style={{ marginTop: '10px' }}>
            New admin? <span className="link" onClick={switchToRegister}>Register here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
