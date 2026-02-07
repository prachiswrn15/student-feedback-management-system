// App.js
import React, { useState, useEffect } from 'react';
import FeedbackForm from './pages/FeedbackForm';
import FeedbackList from './pages/FeedbackList';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const [reload, setReload] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true); 

  useEffect(() => {
    const admin = localStorage.getItem('isAdmin');
    setIsLoggedIn(admin === 'true');
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isAdmin', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <div className={darkMode ? 'dark main-wrapper' : 'main-wrapper'}>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>

        <h1 className="app-title">🎓 Student Feedback Management System</h1>

        {isLoggedIn ? (
          <>
            <button
              className="delete-button"
              onClick={handleLogout}
              style={{ width: '100px', marginBottom: '20px' }}
            >
              🚪 Logout
            </button>

            <FeedbackForm onFeedbackSubmit={() => setReload(!reload)} />
            <div className="divider-line"></div>
            <FeedbackList reload={reload} isAdmin={true} />
          </>
        ) : showLogin ? (
          <AdminLogin
            onLogin={handleLogin}
            switchToRegister={() => setShowLogin(false)}
          />
        ) : (
          <AdminRegister
            switchToLogin={() => setShowLogin(true)}
          />
        )}

        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;
