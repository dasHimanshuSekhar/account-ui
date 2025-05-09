import React, { useState } from 'react';
import { BASE_URL, getTheme, globalStyles } from './config';
import { getCommonStyles } from './theme';
import { useTheme } from './ThemeContext';
import { formatDateTime } from './utils';

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
    mobileNumber: localStorage.getItem('devoteeToken') || '',
    purpose: '',
    isIncome: false,
    isOnline: true,
    category: '',
    transactionDateTime: new Date().toISOString().slice(0, 16), // Initialize with current date-time
    totalTransactionAmount: '',
    transactionRefurbishmentStatus: false,
    remarks: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const theme = getTheme(isDarkMode);
  const commonStyles = getCommonStyles(theme);

  // Styles
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
    padding: '30px',
    margin: '32px auto',
    maxWidth: '600px',
    width: '95%',
    border: `1.5px solid ${theme.colors.border}`,
    backdropFilter: 'blur(2px)'
  };

  const labelStyle = {
    marginBottom: '6px',
    fontWeight: 600,
    color: theme.colors.accent,
    fontFamily: theme.typography.fontSecondary,
    fontSize: '1.05em'
  };

  const inputStyle = {
    ...commonStyles.input,
    width: '100%',
    marginBottom: '15px',
    padding: '12px',
    borderRadius: '8px',
    border: `1.5px solid ${theme.colors.border}`,
    background: theme.colors.inputBg,
    color: theme.colors.inputText,
    fontSize: '1.05em'
  };

  const buttonStyle = {
    ...theme.components.button,
    background: theme.colors.accent,
    color: isDarkMode ? '#222' : '#fff',
    border: 'none',
    borderRadius: theme.components.button.borderRadius,
    cursor: 'pointer',
    fontFamily: theme.typography.fontSecondary,
    marginTop: '10px',
    width: '100%',
    fontSize: '1.1em'
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === 'transactionDateTime') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (selectedDate > today) {
        alert('Transaction date cannot be in the future');
        return;
      }
      
      // Store ISO string for input field, but format for backend when submitting
      setTransactionData(prevData => ({
        ...prevData,
        [name]: value
      }));
      return;
    }
    
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

    const formattedDate = new Date(transactionData.transactionDateTime)
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/, '$1-$2-$3 $4:$5');

    const submissionData = {
      ...transactionData,
      transactionDateTime: formattedDate
    };

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(submissionData)], {
      type: "application/json"
    }));
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const response = await fetch(`${BASE_URL}/transaction/add-transactions`, {
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
          transactionDateTime: '',
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
        }}>Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <select
            name="category"
            value={transactionData.category}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Select Category"
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

          <input
            type="datetime-local"
            name="transactionDateTime"
            value={transactionData.transactionDateTime}
            onChange={handleChange}
            required
            max={new Date().toISOString().slice(0, 16)} // Restrict future dates in picker
            style={inputStyle}
          />

          <select
            name="isOnline"
            value={transactionData.isOnline}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="true">UPI / Online</option>
            <option value="false">Cash</option>
          </select>

          <input
            type="text"
            name="purpose"
            value={transactionData.purpose}
            onChange={handleChange}
            placeholder="Purpose of Transaction"
            required
            style={inputStyle}
          />

          <input
            type="number"
            name="totalTransactionAmount"
            value={transactionData.totalTransactionAmount}
            onChange={handleChange}
            placeholder="Amount"
            required
            style={inputStyle}
          />

          <textarea
            name="remarks"
            value={transactionData.remarks}
            onChange={handleChange}
            placeholder="Remarks (optional)"
            style={inputStyle}
          />

          <input
            type="file"
            name="attachment"
            onChange={handleAttachmentChange}
            style={inputStyle}
          />

          <button
            type="submit"
            style={buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;
