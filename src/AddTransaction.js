import React, { useState } from 'react';

function AddTransaction() {
  const [transactionData, setTransactionData] = useState({
    mobileNumber: '',
    purpose: '',
    isIncome: false,
    isOnline: true, // Default to credit (true)
    category: '',
    totalTransactionAmount: '',
    transactionRefurbishmentStatus: false,
    remarks: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === 'mobileNumber') {
      if (value.length <= 10 && /^\d+$/.test(value)) {
        setTransactionData(prevData => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === 'isOnline') {
      setTransactionData(prevData => ({
        ...prevData,
        [name]: value === 'true',
      }));
    } else if (name === 'isIncome') {
      setTransactionData(prevData => ({
        ...prevData,
        [name]: value === 'true',
        transactionRefurbishmentStatus: false, // Reset refurbishment status
      }));
    }
     else {
      setTransactionData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://01de893a-a4b9-4c34-933f-7d799abd96a7.e1-us-east-azure.choreoapps.dev/transaction/add-transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        alert('Transaction added successfully!');
        setTransactionData({  // Reset form after successful submission
          mobileNumber: '',
          purpose: '',
          isIncome: false,
          isOnline: true, // Default to credit (true)
          category: '',
          totalTransactionAmount: '',
          transactionRefurbishmentStatus: false,
          remarks: '',
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to add transaction: ${errorData.statusDesc || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the transaction.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{
        width: '95%', // Make form wider on smaller screens
        maxWidth: '600px', // Limit maximum width
        padding: '10px', // Reduced padding for smaller screens
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
      }}>
        <h2 style={{ textAlign: 'center', color: '#333', fontSize: '1.2em' }}>Add Transaction</h2> {/* Reduced font size */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}> {/* Reduced gap */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '3px', fontWeight: 'bold', color: '#555', fontSize: '0.8em' }}>Mobile Number:</label>
            <input
              type="number"
              name="mobileNumber"
              value={transactionData.mobileNumber}
              onChange={handleChange}
              required
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.8em' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '3px', fontWeight: 'bold', color: '#555', fontSize: '0.8em' }}>Purpose of Transaction:</label>
            <input
              type="text"
              name="purpose"
              value={transactionData.purpose}
              onChange={handleChange}
              required
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.8em' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '3px', fontWeight: 'bold', color: '#555', fontSize: '0.8em' }}>Transaction Medium:</label>
            <select
              name="isOnline"
              value={transactionData.isOnline}
              onChange={handleChange}
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.8em' }}
            >
              <option value="true">UPI / Online</option>
              <option value="false">Cash</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '3px', fontWeight: 'bold', color: '#555', fontSize: '0.8em' }}>Transaction Type:</label>
            <select
              name="isIncome"
              value={transactionData.isIncome}
              onChange={handleChange}
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.8em' }}
            >
              <option value="true">Credit</option>
              <option value="false">Debit</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '3px', fontWeight: 'bold', color: '#555', fontSize: '0.8em' }}>Category:</label>
            <select
              name="category"
              value={transactionData.category}
              onChange={handleChange}
              required
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.8em' }}
            >
              <option value="">Select a category</option>
              <option value="Grocery">Grocery</option>
              <option value="Others">Others</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Gas">Gas</option>
              <option value="Electricity">Electricity</option>
              <option value="Petrol">Petrol</option>
              <option value="Bace Devotee Rent">Bace Devotee Rent</option>
              <option value="Maintainance">Maintainance</option>
              <option value="Center Rent">Center Rent</option>
              <option value="Bace Rent">Bace Rent</option>
              <option value="Toto Outcome">Toto Outcome</option>
              <option value="Donation">Donation</option>
              <option value="Cook Devotee Salary">Cook Devotee Salary</option>
              <option value="Cook Helper Salary">Cook Helper Salary</option>
              <option value="Toto Maintainer Salary">Toto Maintainer Salary</option>
              <option value="Camp">Camp</option>
              <option value="Preaching">Preaching</option>
              <option value="Maintainance Item sold">Maintainance Item sold</option>
              <option value="Water Bill">Water Bill</option>
              <option value="Dairy Product">Dairy Product</option>
              <option value="Deity">Deity</option>
              <option value="Fruits">Fruits</option>
              <option value="Packaging Items">Packaging Items</option>
              <option value="Journey Prasad">Journey Prasad</option>
              <option value="Prasadam Laxmi(Monthly)">Prasadam Laxmi(Monthly)</option>
              <option value="Prasadam Laxmi(Daily)">Prasadam Laxmi(Daily)</option>
              <option value="Loan By Devotee">Loan By Devotee</option>
              <option value="Refurbishment to Devotee">Refurbishment to Devotee</option>
              <option value="Cash">Cash</option>
              <option value="Toto Purchased Items">Toto Purchased Items</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '3px', fontWeight: 'bold', color: '#555', fontSize: '0.8em' }}>Total Transaction Amount:</label>
            <input
              type="number"
              name="totalTransactionAmount"
              value={transactionData.totalTransactionAmount}
              onChange={handleChange}
              required
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.8em' }}
            />
          </div>
          {transactionData.isIncome === false && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '3px', fontWeight: 'bold', color: '#555', fontSize: '0.8em' }}>Do you want Refurbishment:</label>
              <select
                name="transactionRefurbishmentStatus"
                value={transactionData.transactionRefurbishmentStatus}
                onChange={handleChange}
                style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.8em' }}
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '3px', fontWeight: 'bold', color: '#555', fontSize: '0.8em' }}>Remarks / Summary:</label>
            <textarea
              name="remarks"
              value={transactionData.remarks}
              onChange={handleChange}
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px', fontSize: '0.8em' }}
            />
          </div>
          <button type="submit" style={{
            padding: '6px 10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.7em',
            transition: 'background-color 0.3s ease',
          }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#367c39'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; }}
          >Add Transaction</button>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;
