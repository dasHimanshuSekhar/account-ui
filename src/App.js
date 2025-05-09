import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import AddTransaction from './AddTransaction';
import HomePage from './HomePage'; // Import the new component
import { Buffer } from 'buffer'; // Import Buffer from buffer package
import DevoteeRegistration from './DevoteeRegistration';
import DevoteeLogin from './DevoteeLogin';
import { BASE_URL, ADMIN_MOBILE } from './config';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [statusDesc, setStatusDesc] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    mode: '',
    category: '',
    refurbishmentStatus: '',
    amountMin: '',
    amountMax: '',
    dateMin: '',
    dateMax: '',
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const [devoteeToken, setDevoteeToken] = useState(localStorage.getItem('devoteeToken') || null);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [devoteeName, setDevoteeName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('devoteeToken');
    if (token) {
      setDevoteeToken(token);
      resetSessionTimeout(); // Start session timeout on login
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [devoteeToken]);

  const fetchTransactions = () => {
    if (!devoteeToken) {
      setTransactions([]);
      return;
    }

    const isAdmin = devoteeToken === ADMIN_MOBILE;
    const apiUrl = isAdmin 
      ? `${BASE_URL}/transaction/fetch-transactions`  // Admin gets all transactions
      : `${BASE_URL}/transaction/fetch-transactions?mobileNumber=${devoteeToken}`; // Users get filtered

    fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${devoteeToken}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API response:', data);
        setStatusDesc(data.statusDesc);
        if (data.detailedTransactions && Array.isArray(data.detailedTransactions)) {
          setTransactions(data.detailedTransactions);
          // Set devotee name from first transaction if not admin
          if (!isAdmin && data.detailedTransactions.length > 0) {
            setDevoteeName(data.detailedTransactions[0].name);
          }
        } else {
          setTransactions([]);
        }
      })
      .catch((error) => {
        console.error('API fetch error:', error);
        setTransactions([]);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('devoteeToken');
    setDevoteeToken(null);
    clearTimeout(sessionTimeout); // Clear the timeout
    alert('Logged out successfully!');
    window.location.reload(); // Force reload to update navigation
  };

  const resetSessionTimeout = () => {
    clearTimeout(sessionTimeout);
    const timeoutId = setTimeout(() => {
      handleLogout();
      alert('Session timed out due to inactivity.');
    }, 30 * 60 * 1000); // 30 minutes
    setSessionTimeout(timeoutId);
  };

  useEffect(() => {
    // Reset timeout on activity
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetSessionTimeout);
    });
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetSessionTimeout);
      });
      clearTimeout(sessionTimeout);
    };
  }, []);

  useEffect(() => {
    // Add viewport meta tag on component mount
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(viewport);

    // Clean up on unmount
    return () => {
      document.head.removeChild(viewport);
    };
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = React.useMemo(() => {
    let sortableTransactions = [...transactions];
    if (sortConfig !== null) {
      sortableTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  }, [transactions, sortConfig]);

  const filteredTransactions = sortedTransactions.filter((tx) => {
    const { name, type, mode, category, refurbishmentStatus, amountMin, amountMax, dateMin, dateMax } = filters;

    const nameMatch = tx.name.toLowerCase().includes(name.toLowerCase());
    const typeMatch = type === '' || tx.transactionType === type;
    const modeMatch = mode === '' || tx.transactionMode === mode;
    const categoryMatch = category === '' || tx.category === category;
    const refurbishmentStatusMatch = refurbishmentStatus === '' || String(tx.transactionRefurbishmentStatus) === refurbishmentStatus;

    const amount = tx.totalTransactionAmount;
    const amountMinMatch = amountMin === '' || amount >= Number(amountMin);
    const amountMaxMatch = amountMax === '' || amount <= Number(amountMax);

    const transactionDate = new Date(tx.transactionDateTime).getTime();
    const dateMinMatch = dateMin === '' || transactionDate >= new Date(dateMin).getTime();
    const dateMaxMatch = dateMax === '' || transactionDate <= new Date(dateMax).getTime();

    return nameMatch && typeMatch && modeMatch && categoryMatch && refurbishmentStatusMatch && amountMinMatch && amountMaxMatch && dateMinMatch && dateMaxMatch;
  });

  const appStyle = {
    backgroundColor: isDarkMode ? '#282c34' : '#f0f0f0',
    color: isDarkMode ? '#fff' : '#282c34',
    padding: '8px', // Further reduced padding for even smaller screens
    fontFamily: 'Arial, sans-serif',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: isDarkMode ? '#3e4451' : '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Reduced shadow
    color: isDarkMode ? '#fff' : '#282c34',
    overflowX: 'auto', // Enable horizontal scrolling for the table on smaller screens
    fontSize: '0.8em', // Reduce font size in table
  };

  const headerRowStyle = {
    backgroundColor: '#4CAF50',
    color: '#fff',
  };

  const headerStyle = {
    border: '1px solid #4CAF50',
    padding: '6px', // Further reduced padding for headers
    textAlign: 'left',
    cursor: 'pointer',
  };

  const rowStyle = {
    backgroundColor: isDarkMode ? '#4b5263' : '#f9f9f9',
  };

  const cellStyle = {
    border: '1px solid #4CAF50',
    padding: '6px', // Further reduced padding for cells
  };

  // Add styles for transaction rows
  const getRowStyle = (isCredit, isDarkMode) => ({
    backgroundColor: isCredit 
      ? (isDarkMode ? '#1b4e1b' : '#e8f5e9') // Green for credit
      : (isDarkMode ? '#4e1b1b' : '#ffebee'), // Red for debit
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterTransactions = (transactions) => {
    if (!searchTerm) return transactions;

    return transactions.filter(tx => {
      const searchLower = searchTerm.toLowerCase();
      if (devoteeToken === ADMIN_MOBILE) {
        // Convert mobile number to string before using includes
        return (tx.name?.toLowerCase() || '').includes(searchLower) ||
               (tx.mobileNumber?.toString() || '').includes(searchTerm) ||
               (tx.category?.toLowerCase() || '').includes(searchLower);
      } else {
        // Non-admin can only search by category
        return (tx.category?.toLowerCase() || '').includes(searchLower);
      }
    });
  };

  return (
    <Router>
      <div className="App" style={appStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid #ccc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{ fontSize: '1.5em', margin: 0 }}>ISKCON Account Portal</h1>
            {devoteeToken && devoteeToken !== ADMIN_MOBILE && devoteeName && (
              <span style={{ 
                fontSize: '1em',
                color: isDarkMode ? '#aaa' : '#666' 
              }}>
                [ {devoteeName} ]
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{
              padding: '6px 10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.7em',
            }}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            {devoteeToken && (
              <button onClick={handleLogout} style={{
                padding: '6px 10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8em',
              }}>Logout</button>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8px', // Further reduced padding
          borderRadius: '5px',
          gap: '8px', // Further reduced gap
          borderTop: '1px solid #ccc',    // Add top border
          borderBottom: '1px solid #ccc', // Add bottom border
          flexWrap: 'wrap', // Allow items to wrap on smaller screens
        }}>
          <nav style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '0px' // Remove margin from nav
          }}>
            <ul style={{ 
              listStyleType: 'none', 
              padding: 0, 
              display: 'flex', 
              gap: '8px', // Further reduced gap
            }}>
              <li style={{ borderRight: '1px solid #ccc', paddingRight: '8px' }}>
                <Link to="/home" style={{ // Change the link to /home
                  padding: '6px 10px', // Further reduced padding for buttons
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s ease',
                  fontSize: '0.8em', // Reduced font size for buttons
                }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#367c39'; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; }}>Home</Link>
              </li>
              {devoteeToken ? (
                <>
                  <li style={{ borderRight: '1px solid #ccc', paddingRight: '8px' }}>
                    <Link to="/" style={{
                      padding: '6px 10px', // Further reduced padding for buttons
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s ease',
                      fontSize: '0.8em', // Reduced font size for buttons
                    }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#367c39'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; }}>View Transactions</Link>
                  </li>
                  <li style={{ borderRight: '1px solid #ccc', paddingRight: '8px' }}>
                    <Link to="/add" style={{
                      padding: '6px 10px', // Further reduced padding for buttons
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s ease',
                      fontSize: '0.8em', // Reduced font size for buttons
                    }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#367c39'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; }}>Add Transaction</Link>
                  </li>
                </>
              ) : (
                <>
                 </>
              )}
               {!devoteeToken && (
                <>
                  <li style={{ borderRight: '1px solid #ccc', paddingRight: '8px' }}>
                    <Link to="/devotee/register" style={{
                      padding: '6px 10px', // Further reduced padding for buttons
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s ease',
                      fontSize: '0.8em', // Reduced font size for buttons
                    }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#367c39'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; }}>Devotee Registration</Link>
                  </li>
                  <li style={{ borderRight: '1px solid #ccc', paddingRight: '8px' }}>
                    <Link to="/devotee/login" style={{
                      padding: '6px 10px', // Further reduced padding for buttons
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s ease',
                      fontSize: '0.8em', // Reduced font size for buttons
                    }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#367c39'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; }}>Devotee Login</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        <Routes>
          <Route path="/home" element={<HomePage />} /> {/* Add the new route */}
          <Route path="/" element={devoteeToken ? (
            <>
              <div style={{ 
                padding: '15px', 
                backgroundColor: isDarkMode ? '#2d333b' : '#f5f5f5',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {/* Unified search bar */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder={devoteeToken === ADMIN_MOBILE ? 
                    "Search by name, mobile, or category..." : 
                    "Search by category..."}
                  style={{ 
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    width: '300px'
                  }}
                />
                
                {/* Date range filter */}
                <input
                  type="date"
                  name="dateMin"
                  value={filters.dateMin}
                  onChange={handleFilterChange}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                  type="date"
                  name="dateMax"
                  value={filters.dateMax}
                  onChange={handleFilterChange}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                
                {/* Amount range filter */}
                <input
                  type="number"
                  name="amountMin"
                  placeholder="Min Amount"
                  value={filters.amountMin}
                  onChange={handleFilterChange}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                  type="number"
                  name="amountMax"
                  placeholder="Max Amount"
                  value={filters.amountMax}
                  onChange={handleFilterChange}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <table style={tableStyle}>
                <thead>
                  <tr style={headerRowStyle}>
                    {devoteeToken === ADMIN_MOBILE ? (
                      <>
                        <th style={headerStyle}>Name</th>
                        <th style={headerStyle}>Mobile</th>
                        <th style={headerStyle}>Date & Time</th>
                        <th style={headerStyle}>Category</th>
                        <th style={headerStyle}>Amount</th>
                        <th style={headerStyle}>Attachment</th>
                      </>
                    ) : (
                      <>
                        <th style={headerStyle}>Date & Time</th>
                        <th style={headerStyle}>Category</th>
                        <th style={headerStyle}>Amount</th>
                        <th style={headerStyle}>Attachment</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filterTransactions(filteredTransactions).map((tx, index) => (
                    <tr key={tx.transactionId} 
                        style={getRowStyle(tx.isIncome, isDarkMode)}>
                      {devoteeToken === ADMIN_MOBILE ? (
                        <>
                          <td style={cellStyle}>{tx.name}</td>
                          <td style={cellStyle}>{tx.mobileNumber}</td>
                          <td style={cellStyle}>{new Date(tx.transactionDateTime).toLocaleString()}</td>
                          <td style={cellStyle}>{tx.category}</td>
                          <td style={cellStyle}>₹{tx.totalTransactionAmount}</td>
                          <td style={cellStyle}>
                            {tx.base64Attachment ? (
                              <a href={URL.createObjectURL(new Blob([Buffer.from(tx.base64Attachment, 'base64')], 
                                 {type: 'image/png'}))} target="_blank" rel="noopener noreferrer">
                                View Attachment
                              </a>
                            ) : 'No Attachment'}
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={cellStyle}>{new Date(tx.transactionDateTime).toLocaleString()}</td>
                          <td style={cellStyle}>{tx.category}</td>
                          <td style={cellStyle}>₹{tx.totalTransactionAmount}</td>
                          <td style={cellStyle}>
                            {tx.base64Attachment ? (
                              <a href={URL.createObjectURL(new Blob([Buffer.from(tx.base64Attachment, 'base64')],
                                 {type: 'image/png'}))} target="_blank" rel="noopener noreferrer">
                                View Attachment
                              </a>
                            ) : 'No Attachment'}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTransactions.length === 0 && <p>No transactions found.</p>}
            </>
          ) : (
            <Navigate to="/home" replace />
          )} />
          <Route path="/add" element={devoteeToken ? <AddTransaction /> : <Navigate to="/devotee/login" replace />} />
          <Route path="/devotee/register" element={<DevoteeRegistration />} />
          <Route path="/devotee/login" element={<DevoteeLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
