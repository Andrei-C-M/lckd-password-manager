import React, { useState } from 'react';

const PasswordItem = ({ password, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const copyToClipboard = (text) => {
    // TDoes the browser support modern clipboardf API?
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback();
      }).catch(() => {
        // Fallback to legacy method
        fallbackCopyToClipboard(text);
      });
    } else {
      // Fallback for HTTP sites
      fallbackCopyToClipboard(text);
    }
  };



  // Use that fake text input thingy for copying stuff
  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showCopyFeedback();
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy to clipboard');
    }
    //clean up afterwards
    document.body.removeChild(textArea);
  };

  const showCopyFeedback = () => {
    // Get that yummy feedback 
    console.log('Copied to clipboard!');
    // just log it!
  };


  //extract the websitedomain 
  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="password-item">
      <div className="password-info">
        <div className="website-info">
          <h3>{getDomainFromUrl(password.website)}</h3>
          <p className="website-url">{password.website}</p>
        </div>
        
        <div className="username-info">
          <label>Username:</label>
          <div className="username-container">
            <span>{password.username}</span>

            // not sure if i want to keep it
            <button
              className="copy-button"
              onClick={() => copyToClipboard(password.username)}
              title="Copy username"
            >
              📋
            </button>
          </div>
        </div>
        
        <div className="password-info">
          <label>Password:</label>
          <div className="password-container">
            <span className="password-text">
              {showPassword ? password.password : '••••••••••••'}
            </span>
            <button
              className="toggle-button"
              onClick={togglePasswordVisibility}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
            <button
              className="copy-button"
              onClick={() => copyToClipboard(password.password)}
              title="Copy password"
            >
              📋
            </button>
          </div>
        </div>
      </div>
      
      <div className="password-actions">
        <button
          className="edit-button"
          onClick={() => onEdit(password)}
          title="Edit password"
        >
          ✏️
        </button>
        <button
          className="delete-button"
          onClick={() => onDelete(password.id)}
          title="Delete password"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default PasswordItem;
