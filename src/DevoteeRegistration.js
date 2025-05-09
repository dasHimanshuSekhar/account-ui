import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, getTheme, globalStyles } from './config';
import { getCommonStyles } from './theme';
import { useTheme } from './ThemeContext';

function DevoteeRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: ''
  });

  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);
  const commonStyles = getCommonStyles(theme);

  const pageStyle = {
    minHeight: '100vh',
    minWidth: '100vw',
    background: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.typography.fontPrimary,
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background 0.5s, color 0.5s'
  };

  const cardStyle = {
    background: theme.colors.card,
    borderRadius: theme.components.card.borderRadius,
    boxShadow: theme.colors.shadow,
    padding: theme.components.card.padding,
    margin: '32px auto',
    maxWidth: '600px', // Match login form width
    width: '95%', // Responsive width
    border: `1.5px solid ${theme.colors.border}`,
    backdropFilter: 'blur(2px)'
  };

  const inputStyle = {
    ...commonStyles.input,
    width: '100%',
    marginBottom: '18px',
    boxShadow: theme.colors.shadow,
  };

  const buttonStyle = {
    ...theme.components.button,
    background: theme.colors.accent,
    color: isDarkMode ? '#222' : '#fff',
    border: 'none',
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    fontSize: '1.1em',
    cursor: 'pointer'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/devotee/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          mobileNumber: formData.mobileNumber
        }),
      });

      const data = await response.json();
      if (data.statusCode === 0) {
        alert('Registration successful!');
        navigate('/devotee/login');
      } else {
        alert(data.statusDesc || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration');
    }
  };

  return (
    <div style={pageStyle}>
      <style>
        {globalStyles}
        {commonStyles.globalInputStyles}
      </style>
      <div style={cardStyle}>
        <h2 style={{
          color: theme.colors.heading,
          textAlign: 'center',
          marginBottom: '24px',
          fontSize: '1.5em',
          fontFamily: theme.typography.fontSecondary
        }}>Devotee Registration</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default DevoteeRegistration;
