import React, { useState, useEffect } from 'react';

const PasswordForm = ({ password, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    website: '',
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (password) {
      setFormData({
        website: password.website || '',
        username: password.username || '',
        password: password.password || ''
      });
    }
  }, [password]);

  const generatePassword = () => {
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
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle, shuffle
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setGeneratedPassword(newPassword);
    setFormData(prev => ({ ...prev, password: newPassword }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.website && formData.username && formData.password && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSave(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-form-overlay">
      <div className="password-form">
        <h2>{password ? 'Edit LCKD' : 'New LCKD'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="google.com or https://google.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
              <button
                type="button"
                className="password-generate"
                onClick={generatePassword}
                title="Generate password"
              >
                🔄
              </button>
            </div>
          </div>
          
          {generatedPassword && (
            <div className="generated-password">
              <p>Generated password: <strong>{generatedPassword}</strong></p>
            </div>
          )}
          
          <div className="password-requirements">
            <p>Password requirements:</p>
            <div className="requirements">
              <span className={formData.password.length >= 8 ? 'met' : 'unmet'}>#</span>
              <span className={/[!@#$%^&*]/.test(formData.password) ? 'met' : 'unmet'}>@</span>
              <span className={/\d/.test(formData.password) ? 'met' : 'unmet'}>123</span>
              <span className={/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'met' : 'unmet'}>Aa</span>
              <span className="met">pwnd</span>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={isSubmitting}>
              {isSubmitting ? 'SAVING...' : (password ? 'UPDATE LCKD' : 'CREATE LCKD')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordForm;
