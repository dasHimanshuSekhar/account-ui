import React from 'react';
import { getTheme, globalStyles } from './config';
import { getCommonStyles } from './theme';
import { useTheme } from './ThemeContext';

function HomePage() {
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);
  const commonStyles = getCommonStyles(theme);

  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh'
  };

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      background: theme.colors.background,
      color: theme.colors.text,
      fontFamily: theme.typography.fontPrimary,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background 0.5s, color 0.5s'
    }}>
      <style>
        {globalStyles}
        {commonStyles.globalInputStyles}
        {`
          input, select, textarea {
            color: ${theme.colors.inputText} !important;
            background: ${theme.colors.inputBg} !important;
          }
          input::placeholder, textarea::placeholder {
            color: ${theme.colors.inputText} !important;
            opacity: 0.7 !important;
          }
        `}
      </style>
      <h1 style={{
        fontSize: '1.5em', // Further reduced font size for smaller screens
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center'
      }}>
        Welcome to ISKCON Account Portal Home Page
      </h1>
    </div>
  );
}

export default HomePage;
