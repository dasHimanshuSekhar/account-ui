import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from './config';

function DevoteeLogin() {
  const [loginData, setLoginData] = useState({
    mobileNumber: '',
    password: '',
  });
  const navigate = useNavigate();

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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{
        width: '95%',
        maxWidth: '600px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
      }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Devotee Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Mobile Number:</label>
            <input
              type="text"
              name="mobileNumber"
              value={loginData.mobileNumber}
              onChange={handleChange}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              pattern="[0-9]{10}"
            />
          </div>
          <div>
            <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Password:</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#367c39'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; }}
          >Login</button>
        </form>
      </div>
    </div>
  );
}

export default DevoteeLogin;
