import React from 'react';

function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh' 
    }}>
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
