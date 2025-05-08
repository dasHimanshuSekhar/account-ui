import React, { useState } from 'react';

function DevoteeRegistration() {
  const [devoteeData, setDevoteeData] = useState({
    mobileNumber: '',
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDevoteeData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://01de893a-a4b9-4c34-933f-7d799abd96a7.e1-us-east-azure.choreoapps.dev/devotee/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devoteeData),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert(responseData.statusDesc);
        setDevoteeData({
          mobileNumber: '',
          name: '',
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to register devotee: ${errorData.statusDesc || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while registering the devotee.');
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
        <h2 style={{ textAlign: 'center', color: '#333' }}>Devotee Registration</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Mobile Number:</label>
            <input
              type="text"
              name="mobileNumber"
              value={devoteeData.mobileNumber}
              onChange={handleChange}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', appearance: 'textfield', MozAppearance: 'textfield' }}
              pattern="[0-9]{10}"
            />
          </div>
          <div>
            <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Name:</label>
            <input
              type="text"
              name="name"
              value={devoteeData.name}
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
          >Register</button>
        </form>
      </div>
    </div>
  );
}

export default DevoteeRegistration;
