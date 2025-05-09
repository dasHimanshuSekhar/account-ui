import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import AddTransaction from './AddTransaction';
import HomePage from './HomePage'; // Import the new component
import { Buffer } from 'buffer'; // Import Buffer from buffer package
import DevoteeRegistration from './DevoteeRegistration';
import DevoteeLogin from './DevoteeLogin';
import { BASE_URL, ADMIN_MOBILE, getTheme } from './config'; // Add getTheme to the import
import { ThemeProvider, useTheme } from './ThemeContext'; // Ensure ThemeProvider and useTheme are imported

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const { isDarkMode, setIsDarkMode } = useTheme(); // Retrieve theme context
  const theme = getTheme(isDarkMode); // Get the theme based on dark mode

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
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
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const [devoteeToken, setDevoteeToken] = useState(localStorage.getItem('devoteeToken') || null);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [devoteeName, setDevoteeName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null); // Add notification state

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

    setIsLoading(true); // Start loading
    const isAdmin = devoteeToken === ADMIN_MOBILE;
    const apiUrl = isAdmin 
      ? `${BASE_URL}/transaction/fetch-transactions`  // Admin gets all transactions
      : `${BASE_URL}/transaction/fetch-transactions?mobileNumber=${devoteeToken}`; // Users get filtered

    fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${devoteeToken}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        return response.json();
      })
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
        setNotification('Failed to fetch transactions. Please try again.');
        setTransactions([]);
      })
      .finally(() => {
        setIsLoading(false); // End loading
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
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    backgroundImage: `url('/path/to/background-image.jpg')`, // Add background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    opacity: 0.95, // Make the background image more visible
    fontFamily: theme.typography.fontPrimary,
    minHeight: '100vh',
    padding: '8px'
  };

  const filterContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap', // Ensure filters stay in a single line
    gap: '10px',
    padding: '10px',
    backgroundColor: theme.colors.card, // Use theme.colors.card
    borderRadius: '16px', // Add curvy border
    boxShadow: theme.colors.shadow, // Add shadow for better visibility
    marginBottom: '16px',
    border: `1px solid ${theme.colors.border}` // Add border
  };

  const filterInputStyle = {
    padding: '10px',
    borderRadius: '8px', // Add slight curve to inputs
    border: `1px solid ${theme.colors.border}`, // Use theme.colors.border
    backgroundColor: theme.colors.inputBg, // Use theme.colors.inputBg
    color: theme.colors.inputText, // Use theme.colors.inputText
    fontSize: '0.9em',
    flex: '1', // Ensure inputs adjust to available space
    minWidth: '150px',
    maxWidth: '200px',
    outline: 'none',
    transition: 'background 0.3s, color 0.3s, border 0.3s'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: theme.colors.card, // Use theme.colors.card
    boxShadow: theme.colors.shadow, // Use theme.colors.shadow
    color: theme.colors.text, // Use theme.colors.text
    borderRadius: '16px', // Add curvy border
    overflow: 'hidden', // Ensure content stays within the rounded border
    fontSize: '0.9em',
    marginTop: '16px'
  };

  const headerRowStyle = {
    backgroundColor: theme.colors.tableHeader, // Use theme.colors.tableHeader
    color: theme.colors.accent, // Use theme.colors.accent
    fontWeight: 700,
    fontSize: '1em',
    letterSpacing: '0.5px',
    borderBottom: `2px solid ${theme.colors.border}`, // Use theme.colors.border
    textAlign: 'left'
  };

  const headerStyle = {
    padding: '12px',
    border: `1px solid ${theme.colors.border}`, // Use theme.colors.border
    cursor: 'pointer',
    backgroundColor: theme.colors.card, // Use theme.colors.card
    transition: 'background 0.3s, color 0.3s'
  };

  const cellStyle = {
    padding: '12px',
    border: `1px solid ${theme.colors.border}`, // Use theme.colors.border
    backgroundColor: theme.colors.card, // Use theme.colors.card
    color: theme.colors.text, // Use theme.colors.text
    transition: 'background 0.3s, color 0.3s'
  };

  const getRowStyle = (isCredit) => ({
    backgroundColor: isCredit
      ? (isDarkMode ? 'rgba(30, 77, 140, 0.1)' : 'rgba(212, 175, 55, 0.1)')
      : (isDarkMode ? 'rgba(198, 40, 40, 0.1)' : 'rgba(255, 87, 34, 0.1)'),
    color: theme.colors.text, // Use theme.colors.text
    fontWeight: 500,
    transition: 'background 0.3s'
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

  const navLinkStyle = {
    padding: '10px 20px',
    background: theme.colors.accent, // Use theme.colors.accent
    color: isDarkMode ? '#222' : '#fff',
    textDecoration: 'none',
    borderRadius: theme.components.button.borderRadius, // Use theme.components.button.borderRadius
    fontSize: '1em',
    fontWeight: 600,
    fontFamily: theme.typography.fontSecondary, // Use theme.typography.fontSecondary
    letterSpacing: '0.04em',
    transition: 'background 0.3s, color 0.3s',
    display: 'inline-block',
    textAlign: 'center',
    margin: '0 8px',
    cursor: 'pointer',
    border: 'none'
  };

  const navBarStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px 0',
    background: theme.colors.card, // Use theme.colors.card
    borderBottom: `2px solid ${theme.colors.border}`, // Use theme.colors.border
    borderTop: `2px solid ${theme.colors.border}`,
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '10px'
  };

  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  };

  const buttonStyle = {
    padding: '8px 12px',
    borderRadius: theme.components.button.borderRadius,
    backgroundColor: theme.colors.accent,
    color: isDarkMode ? '#222' : '#fff',
    border: 'none',
    cursor: 'pointer',
    fontFamily: theme.typography.fontSecondary,
    fontSize: '0.9em',
    fontWeight: 600,
    transition: 'background 0.3s, color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    '&:hover': {
      backgroundColor: theme.colors.accentHover // Add hover effect
    }
  };

  const inputStyle = {
    ...filterInputStyle,
    '&:hover': {
      borderColor: theme.colors.accent // Add hover effect for inputs
    }
  };

  const notificationStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: theme.colors.errorBg, // Use theme for error background
    color: theme.colors.errorText, // Use theme for error text
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: theme.colors.shadow,
    zIndex: 1000,
    fontFamily: theme.typography.fontSecondary,
    fontSize: '0.9em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  };

  const spinnerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px'
  };

  const spinnerCircleStyle = {
    width: '40px',
    height: '40px',
    border: `4px solid ${theme.colors.border}`,
    borderTop: `4px solid ${theme.colors.accent}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const dismissNotification = () => setNotification(null);

  const headerContainerStyle = {
    background: theme.colors.card,
    padding: '20px',
    borderBottom: `2px solid ${theme.colors.border}`,
    boxShadow: theme.colors.shadow,
    marginBottom: '20px'
  };

  const headingStyle = {
    fontSize: '2em',
    fontFamily: theme.typography.fontSecondary,
    fontWeight: 700,
    color: theme.colors.accent,
    margin: 0,
    letterSpacing: '0.02em',
    textAlign: 'center'
  };

  return (
    <div className="App" style={appStyle}>
      {notification && (
        <div style={notificationStyle}>
          <span>{notification}</span>
          <button onClick={dismissNotification} style={{ ...buttonStyle, padding: '4px 8px' }}>Dismiss</button>
        </div>
      )}

      <div style={headerContainerStyle}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={headingStyle}>ISKCON Account Portal</h1>
            {devoteeToken && devoteeToken !== ADMIN_MOBILE && devoteeName && (
              <span style={{ 
                fontSize: '1.1em', 
                color: theme.colors.text,
                fontFamily: theme.typography.fontSecondary
              }}>
                [ {devoteeName} ]
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={buttonStyle}
            >
              {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            {devoteeToken && (
              <button
                onClick={handleLogout}
                style={buttonStyle}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={navBarStyle}>
        <nav style={navContainerStyle}>
          <Link to="/home" style={navLinkStyle}>Home</Link>
          {devoteeToken && (
            <>
              <Link to="/" style={navLinkStyle}>View Transactions</Link>
              <Link to="/add" style={navLinkStyle}>Add Transaction</Link>
            </>
          )}
          {!devoteeToken && (
            <>
              <Link to="/devotee/register" style={navLinkStyle}>Devotee Registration</Link>
              <Link to="/devotee/login" style={navLinkStyle}>Devotee Login</Link>
            </>
          )}
        </nav>
      </div>

      <Routes>
        <Route path="/home" element={<HomePage />} /> {/* Add the new route */}
        <Route path="/" element={devoteeToken ? (
          <div style={{ padding: '16px', backgroundColor: theme.colors.background }}>
            <div style={filterContainerStyle}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder={devoteeToken === ADMIN_MOBILE ? 
                  "Search by name, mobile, or category..." : 
                  "Search by category..."}
                style={inputStyle}
              />
              <input
                type="date"
                name="dateMin"
                value={filters.dateMin}
                onChange={handleFilterChange}
                style={inputStyle}
              />
              <input
                type="date"
                name="dateMax"
                value={filters.dateMax}
                onChange={handleFilterChange}
                style={inputStyle}
              />
              <input
                type="number"
                name="amountMin"
                placeholder="Min Amount"
                value={filters.amountMin}
                onChange={handleFilterChange}
                style={inputStyle}
              />
              <input
                type="number"
                name="amountMax"
                placeholder="Max Amount"
                value={filters.amountMax}
                onChange={handleFilterChange}
                style={inputStyle}
              />
            </div>

            {isLoading ? (
              <div style={spinnerStyle}>
                <div style={spinnerCircleStyle}></div>
              </div>
            ) : (
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
                    <tr key={tx.transactionId} style={getRowStyle(tx.isIncome)}>
                      {devoteeToken === ADMIN_MOBILE ? (
                        <>
                          <td style={cellStyle}>{tx.name}</td>
                          <td style={cellStyle}>{tx.mobileNumber}</td>
                          <td style={cellStyle}>{new Date(tx.transactionDateTime).toLocaleString()}</td>
                          <td style={cellStyle}>{tx.category}</td>
                          <td style={cellStyle}>₹{tx.totalTransactionAmount}</td>
                          <td style={cellStyle}>
                            {tx.base64Attachment ? (
                              <a href={URL.createObjectURL(new Blob([Buffer.from(tx.base64Attachment, 'base64')], { type: 'image/png' }))}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: theme.colors.accent }}
                              >
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
                              <a href={URL.createObjectURL(new Blob([Buffer.from(tx.base64Attachment, 'base64')], { type: 'image/png' }))}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: theme.colors.accent }}
                              >
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
            )}

            {!isLoading && filteredTransactions.length === 0 && (
              <p style={{ textAlign: 'center', color: theme.colors.text }}>No transactions found.</p>
            )}
          </div>
        ) : (
          <Navigate to="/home" replace />
        )} />
        <Route path="/add" element={devoteeToken ? <AddTransaction /> : <Navigate to="/devotee/login" replace />} />
        <Route path="/devotee/register" element={<DevoteeRegistration />} />
        <Route path="/devotee/login" element={<DevoteeLogin />} />
      </Routes>
    </div>
  );
}

export default App;
