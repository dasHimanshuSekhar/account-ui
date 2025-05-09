import prabhupadaMoons from './assets/prabhupada-moons.avif';

export const getTheme = (isDarkMode) => ({
  colors: isDarkMode ? {
    // Rich dark theme with golden accents
    background: `linear-gradient(rgba(19, 17, 24, 0.95), rgba(26, 23, 33, 0.95)), url(${prabhupadaMoons})`,
    card: 'rgba(31, 28, 38, 0.95)',
    text: '#E8D5B5', // Warm light gold for text
    heading: '#FFD700', // Bright gold for headings
    accent: '#C0A080', // Antique gold
    accentSecondary: '#B8860B', // Dark golden rod
    border: 'rgba(255, 215, 0, 0.3)', // Translucent gold
    credit: 'rgba(144, 238, 144, 0.15)', // Soft green
    debit: 'rgba(255, 99, 71, 0.15)', // Soft red
    inputBg: 'rgba(19, 17, 24, 0.9)',
    inputBorder: '#C0A080',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
  } : {
    // Light spiritual theme
    background: `linear-gradient(rgba(253, 252, 248, 0.94), rgba(249, 246, 238, 0.94)), url(${prabhupadaMoons})`,
    card: 'rgba(255, 253, 247, 0.95)',
    text: '#2C1810', // Deep brown
    heading: '#8B4513', // Saddle brown
    accent: '#8B4513', // Saddle brown
    accentSecondary: '#CD853F', // Peru
    border: 'rgba(139, 69, 19, 0.2)', // Translucent brown
    credit: 'rgba(34, 139, 34, 0.1)', // Soft green
    debit: 'rgba(178, 34, 34, 0.1)', // Soft red
    inputBg: 'rgba(255, 253, 247, 0.9)',
    inputBorder: '#8B4513',
    shadow: '0 4px 20px rgba(139, 69, 19, 0.1)'
  },
  typography: {
    fontPrimary: "'Roboto', 'Arial', sans-serif",     // Changed from Crimson Text to Roboto
    fontSecondary: "'Roboto Slab', serif",            // Changed to Roboto Slab for headers
    heading: {
      fontSize: {
        large: '2.5rem',
        medium: '2rem',
        small: '1.5rem'
      },
      letterSpacing: '0.05em',
      fontWeight: 700
    },
    body: {
      fontSize: {
        large: '1.125rem',
        medium: '1rem',
        small: '0.875rem'
      },
      letterSpacing: '0.02em',
      lineHeight: 1.6
    }
  },
  components: {
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    },
    input: {
      padding: '0.75rem 1rem',
      borderRadius: '6px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    card: {
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      backgroundImage: isDarkMode 
        ? 'linear-gradient(45deg, rgba(31, 28, 38, 0.95), rgba(26, 23, 33, 0.95))'
        : 'linear-gradient(45deg, rgba(255, 253, 247, 0.95), rgba(249, 246, 238, 0.95))'
    }
  }
});

export const getCommonStyles = (theme) => ({
  input: {
    color: theme.colors.inputText,
    background: theme.colors.inputBg,
    border: `1.5px solid ${theme.colors.border}`,
    borderRadius: '8px',
    padding: '12px',
    fontSize: '1.05em',
    fontFamily: theme.typography.fontSecondary,
  },
  globalInputStyles: `
    input, select, textarea {
      color: ${theme.colors.inputText} !important;
      background: ${theme.colors.inputBg} !important;
    }
    input::placeholder, textarea::placeholder {
      color: ${theme.colors.inputText} !important;
      opacity: 0.7 !important;
    }
    option {
      color: ${theme.colors.inputText};
      background: ${theme.colors.inputBg};
    }
  `
});

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Slab:wght@400;600;700&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
    min-height: 100vh;
  }

  ::selection {
    background: var(--accent-color);
    color: var(--text-color);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    margin: 0;
  }

  a {
    text-decoration: none;
    transition: all 0.3s ease;
  }

  button, input, select {
    font-family: 'Cormorant Garamond', serif;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--accent-color);
    border-radius: 4px;
  }
`;
