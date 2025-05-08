import React, { useState } from 'react';

// Add category lists
const DEBIT_CATEGORIES = [
  'Grocery', 'Vegetable', 'Gas', 'Petrol', 'Electricity', 'Maintainance',
  'Center Rent', 'Bace Rent', 'Cook Devotee Salary', 'Cook Helper Salary',
  'Toto Maintainer Salary', 'Camp', 'Preaching', 'Water Bill', 'Dairy Product',
  'Deity', 'Fruits', 'Packaging Items', 'Journey Prasad', 'Others',
  'Refurbishment to Devotee', 'Toto Purchased Items'
];

const CREDIT_CATEGORIES = [
  'Bace Devotee Rent', 'Toto Outcome', 'Donation', 'Maintainance Item sold',
  'Prasadam Laxmi(Monthly)', 'Prasadam Laxmi(Daily)', 'HG SJP Paid',
  'Loan By Devotee'
];

function AddTransaction() {
  const [transactionData, setTransactionData] = useState({
    mobileNumber: localStorage.getItem('devoteeToken') || '',  // Initialize with the token
    purpose: '',
    isIncome: false,
    isOnline: true, // Default to credit (true)
    category: '',
    totalTransactionAmount: '',
    transactionRefurbishmentStatus: false,
    remarks: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === 'category') {
      // Auto-set isIncome based on category
      const isCredit = CREDIT_CATEGORIES.includes(value);
      setTransactionData(prevData => ({
        ...prevData,
        [name]: value,
        isIncome: isCredit,
        transactionRefurbishmentStatus: false // Reset refurbishment status
      }));
    } else if (name === 'mobileNumber') {
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

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const maxSizeInBytes = 500 * 1024; // 500KB
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!allowedImageTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or GIF).');
        e.target.value = ''; // Clear the selected file
        setAttachment(null);
        return;
      }

      if (file.size > maxSizeInBytes) {
        alert('The image size must be less than 500KB.');
        e.target.value = ''; // Clear the selected file
        setAttachment(null);
        return;
      }

      setAttachment(file);
    } else {
      setAttachment(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(transactionData)], {
      type: "application/json"
    }));
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const response = await fetch('https://01de893a-a4b9-4c34-933f-7d799abd96a7.e1-us-east-azure.choreoapps.dev/transaction/add-transactions', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Transaction added successfully!');
        setTransactionData({  // Reset form after successful submission
          mobileNumber: localStorage.getItem('devoteeToken') || '',  // Initialize with the token
          purpose: '',
          isIncome: false,
          isOnline: true, // Default to credit (true)
          category: '',
          totalTransactionAmount: '',
          transactionRefurbishmentStatus: false,
          remarks: '',
        });
        setAttachment(null); // Reset attachment
      } else {
        const errorData = await response.json();
        alert(`Failed to add transaction: ${errorData.statusDesc || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the transaction.');
    } finally {
      setIsLoading(false);
    }
  };

  const spinnerStyle = {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s ease-in-out infinite',
    marginRight: '10px'
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
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}> {/* Reduced gap */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '3px', fontWeight: 'bold', color: '#555', fontSize: '0.8em' }}>Mobile Number:</label>
            <input
              type="text"
              name="mobileNumber"
              value={transactionData.mobileNumber}
              readOnly  // Make the field readonly
              style={{ 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ccc', 
                backgroundColor: '#f0f0f0',  // Gray background to indicate readonly
                appearance: 'textfield', // Remove increment/decrement buttons
                MozAppearance: 'textfield',
              }}
              pattern="[0-9]{10}" // Add HTML5 validation for 10 digits
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
            <input
              type="text"
              value={transactionData.isIncome ? 'Credit' : 'Debit'}
              readOnly
              style={{ 
                padding: '4px', 
                borderRadius: '4px', 
                border: '1px solid #ccc', 
                fontSize: '0.8em',
                backgroundColor: '#f0f0f0'  // Gray background to indicate readonly
              }}
            />
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
              <optgroup label="Debit Categories">
                {DEBIT_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </optgroup>
              <optgroup label="Credit Categories">
                {CREDIT_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </optgroup>
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
           <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '3px', fontWeight: 'bold', color: '#555', fontSize: '0.8em' }}>Attachment:</label>
            <input
              type="file"
              name="attachment"
              onChange={handleAttachmentChange}
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.8em' }}
            />
          </div>
          <button 
            type="submit" 
            style={{
              padding: '6px 10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'wait' : 'pointer',
              fontSize: '0.7em',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoading ? 0.7 : 1,
            }}
            disabled={isLoading}
            onMouseOver={(e) => { if (!isLoading) e.target.style.backgroundColor = '#367c39'; }}
            onMouseOut={(e) => { if (!isLoading) e.target.style.backgroundColor = '#4CAF50'; }}
          >
            {isLoading && <div style={spinnerStyle} />}
            {isLoading ? 'Adding Transaction...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;
