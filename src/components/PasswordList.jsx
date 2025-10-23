import React, { useState, useEffect } from 'react';
import PasswordItem from './PasswordItem';
import PasswordForm from './PasswordForm';
import { passwordAPI } from '../services/api';

//load all passwords from the aws db
//handle all the create, read, update, delete passwords operations
//generate random passwords
//add copy functionality


//track that data!
const PasswordList = ({ onLogout }) => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');


  //on component load, fetch passwords and handlke errors
  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    try {
      setLoading(true);
      const response = await passwordAPI.getAll();
      if (response.ok) {
        const data = await response.json();
        setPasswords(data.passwords || []);
      } else {
        setError('Failed to load passwords for some reason');
      }
    } catch (err) {
      setError('Error loading passwords');
      console.error('Error loading passwords:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassword = () => {
    setEditingPassword(null);
    setShowForm(true);
  };

  const handleEditPassword = (password) => {
    setEditingPassword(password);
    setShowForm(true);
  };

  //save to backend and reload ...
  const handleSavePassword = async (passwordData) => {
    try {
      let response;
      if (editingPassword) {
        response = await passwordAPI.update(editingPassword.id, passwordData);
      } else {
        response = await passwordAPI.create(passwordData);
      }

      if (response.ok) {
        setShowForm(false);
        setEditingPassword(null);
        setError(null); // Clear any previous errors
        loadPasswords(); // Reload the list
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          setError(`❌ Duplicate Entry: ${errorData.error}`);
        } else {
          setError(`❌ Error: ${errorData.error || 'Failed to save password'}`);
        }
      }
    } catch (err) {
      setError('❌ Network Error: Unable to save password');
      console.error('Error saving password:', err);
    }
  };


  //delete from backend and reload ...
  const handleDeletePassword = async (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      try {
        const response = await passwordAPI.delete(id);
        if (response.ok) {
          loadPasswords(); // Reload the list
        } else {
          setError('Failed to delete password');
        }
      } catch (err) {
        setError('Error deleting password');
        console.error('Error deleting password:', err);
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPassword(null);
  };

  //the hitchhikers guide to generating random passwords 
  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    
    // Make sure there is AT LEAST one character from each required type
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*";
    
    newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    newPassword += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest with random stuff
    for (let i = 4; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle, shuffle
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    setGeneratedPassword(newPassword);
  };

  const copyGeneratedPassword = () => {
    // Modern clipboard API bs
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(generatedPassword).then(() => {
        console.log('Generated password copied to clipboard');
      }).catch(() => {
        // Fallback 
        fallbackCopyToClipboard(generatedPassword);
      });
    } else {

      // Fallback
      fallbackCopyToClipboard(generatedPassword);
    }
  };

  //use that fake text input thingy for copying stuff again
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
      console.log('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy to clipboard');
    }
    
    document.body.removeChild(textArea);
  };

  //this should be a loading screen, not sure if it works, test before deploying
  
  if (loading) {
    return (
      <div className="password-list">
        <div className="loading">Loading passwords...</div>
      </div>
    );
  }

  return (
    <div className="password-list">
      <div className="header">
        <h1>LCKD</h1>
        <div className="header-right">
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="main-content">
        <div className="actions-section">
          <button className="new-password-button" onClick={handleCreatePassword}>
            NEW LCKD
          </button>
        </div>

        <div className="passwords-section">
          <h2>Your Passwords</h2>
          {passwords.length === 0 ? (
            <div className="no-passwords">
              <p>No passwords saved yet. Click "NEW LCKD" to add your first password!</p>
            </div>
          ) : (
            <div className="passwords-grid">
              {passwords.map((password) => (
                <PasswordItem
                  key={password.id}
                  password={password}
                  onEdit={handleEditPassword}
                  onDelete={handleDeletePassword}
                />
              ))}
            </div>
          )}
        </div>

        <div className="plain-sight-section">
          <h3>PLAIN SIGHT</h3>
          <div className="generated-password-display">
            <div className="password-display">
              <span className="password-text">{generatedPassword || 'Click generate to create a password'}</span>
              <button
                className="generate-button"
                onClick={generateRandomPassword}
                title="Generate new password"
              >
                🔄
              </button>
              {generatedPassword && (
                <button
                  className="copy-button"
                  onClick={copyGeneratedPassword}
                  title="Copy password"
                >
                  📋
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <PasswordForm
          password={editingPassword}
          onSave={handleSavePassword}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default PasswordList;
