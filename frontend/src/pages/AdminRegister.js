import React, { useState } from 'react';
import axios from 'axios';
import './AdminLogin.css'; // Same CSS can be reused

const AdminRegister = ({ switchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPass) return alert("Passwords do not match");
    try {
      await axios.post('http://localhost:5000/api/admin/register', { username, password });
      alert("Registered successfully! You can now log in.");
      switchToLogin();
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <h2>📝 Admin Register</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Create username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
            <span className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈 Hide' : '👁 Show'}
            </span>
          </div>
          <button type="submit" className="login-button">📝 Register</button>
          <p style={{ marginTop: '10px' }}>
            Already have an account? <span className="link" onClick={switchToLogin}>Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
