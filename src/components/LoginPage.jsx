import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now no real authentication, just type anything - ASK CHRISTOFFER before you forget!
    onLogin();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <h1 className="logo">LCKD</h1>
          <p className="tagline">Your passwords in plain sight</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            LET ME IN
          </button>
        </form>
        
        <div className="signup-link">
          <p>Don't have an account? <a href="#" className="signup-text">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
