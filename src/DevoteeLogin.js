import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, getTheme, globalStyles } from './config';
import { getCommonStyles } from './theme';
import { useTheme } from './ThemeContext';

function DevoteeLogin() {
  const [loginData, setLoginData] = useState({
    mobileNumber: '',
    password: '',
  });
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);
  const commonStyles = getCommonStyles(theme);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/devotee/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.statusCode === 0) {
          // Store the mobile number as token
          localStorage.setItem('devoteeToken', loginData.mobileNumber);
          alert(data.statusDesc);
          // Navigate to home page after successful login
          navigate('/');
          // Force a page reload to update navigation
          window.location.reload();
        } else {
          alert(data.statusDesc);
        }
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login.');
    }
  };

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
    maxWidth: '600px',
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
    fontSize: '1.1em'
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
        }}>Devotee Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={loginData.mobileNumber}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default DevoteeLogin;
