import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import AddTransaction from './AddTransaction';
import HomePage from './HomePage'; // Import the new component
import { Buffer } from 'buffer'; // Import Buffer from buffer package

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

  useEffect(() => {
    fetch('https://01de893a-a4b9-4c34-933f-7d799abd96a7.e1-us-east-azure.choreoapps.dev/transaction/fetch-transactions')
      .then((response) => response.json())
      .then((data) => {
        console.log('API response:', data);
        setStatusDesc(data.statusDesc);
        setTransactions(data.detailedTransactions);
      })
      .catch((error) => console.error('API fetch error:', error));
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

  return (
    <Router>
      <div className="App" style={appStyle}>
        <h1 style={{textAlign: 'center', fontSize: '1.5em'}}>ISKCON Account Portal</h1> {/* Reduced font size for heading */}
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
            </ul>
          </nav>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{
            padding: '6px 10px', // Further reduced padding for buttons
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.7em', // Further reduced font size
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => { e.target.style.backgroundColor = '#367c39'; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; }}>{isDarkMode ? '☀️' : '🌙'}</button>
        </div>

        <Routes>
          <Route path="/home" element={<HomePage />} /> {/* Add the new route */}
          <Route path="/" element={
            <>
              <div style={{ marginBottom: '8px' }}> {/* Further reduced margin */}
                <input
                  type="text"
                  name="name"
                  placeholder="Filter by Name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  style={{ padding: '4px', margin: '2px', fontSize: '0.7em' }} // Reduced padding, margin and font size
                />

                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  style={{ padding: '6px', margin: '3px' }} // Reduced padding and margin for selects
                >
                  <option value="">All Types</option>
                  {[...new Set(transactions.map(tx => tx.transactionType))].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <select
                  name="mode"
                  value={filters.mode}
                  onChange={handleFilterChange}
                  style={{ padding: '6px', margin: '3px' }} // Reduced padding and margin for selects
                >
                  <option value="">All Modes</option>
                  {[...new Set(transactions.map(tx => tx.transactionMode))].map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>

                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  style={{ padding: '6px', margin: '3px' }} // Reduced padding and margin for selects
                >
                  <option value="">All Categories</option>
                  {[...new Set(transactions.map(tx => tx.category))].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  name="refurbishmentStatus"
                  value={filters.refurbishmentStatus}
                  onChange={handleFilterChange}
                  style={{ padding: '6px', margin: '3px' }} // Reduced padding and margin for selects
                >
                  <option value="">All Statuses</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>

                <input
                  type="number"
                  name="amountMin"
                  placeholder="Min Amount"
                  value={filters.amountMin}
                  onChange={handleFilterChange}
                  style={{ padding: '6px', margin: '3px' }} // Reduced padding and margin for inputs
                />
                <input
                  type="number"
                  name="amountMax"
                  placeholder="Max Amount"
                  value={filters.amountMax}
                  onChange={handleFilterChange}
                  style={{ padding: '6px', margin: '3px' }} // Reduced padding and margin for inputs
                />

                <input
                  type="date"
                  name="dateMin"
                  placeholder="Min Date"
                  value={filters.dateMin}
                  onChange={handleFilterChange}
                  style={{ padding: '6px', margin: '3px' }} // Reduced padding and margin for inputs
                />
                <input
                  type="date"
                  name="dateMax"
                  placeholder="Max Date"
                  value={filters.dateMax}
                  onChange={handleFilterChange}
                  style={{ padding: '6px', margin: '3px' }} // Reduced padding and margin for inputs
                />
              </div>

              <table style={tableStyle}>
                <thead>
                  <tr style={headerRowStyle}>
                    <th style={headerStyle} onClick={() => handleSort('name')}>
                      Name
                    </th>
                    <th style={headerStyle} onClick={() => handleSort('mobileNumber')}>
                      Mobile
                    </th>
                    <th style={headerStyle} onClick={() => handleSort('totalTransactionAmount')}>
                      Amount
                    </th>
                    <th style={headerStyle} onClick={() => handleSort('transactionType')}>
                      Type
                    </th>
                    <th style={headerStyle} onClick={() => handleSort('category')}>
                      Mode/Category
                    </th>
                    <th style={headerStyle} onClick={() => handleSort('transactionDateTime')}>
                      Date & Time
                    </th>
                    <th style={headerStyle} onClick={() => handleSort('transactionRefurbishmentStatus')}>
                      Refurbishment Status
                    </th>
                    <th style={headerStyle}>
                      Attachment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => (
                    <tr key={tx.transactionId} style={{ ...rowStyle, backgroundColor: index % 2 === 0 ? (isDarkMode ? '#666' : '#f2f2f2') : (isDarkMode ? '#555' : 'white') }}>
                      <td style={cellStyle}>{tx.name}</td>
                      <td style={cellStyle}>{tx.mobileNumber}</td>
                      <td style={cellStyle}>₹{tx.totalTransactionAmount}</td>
                      <td style={cellStyle}>{tx.transactionType}</td>
                      <td style={cellStyle}>{tx.category}</td>
                      <td style={cellStyle}>{new Date(tx.transactionDateTime).toLocaleString()}</td>
                      <td style={cellStyle}>{tx.transactionRefurbishmentStatus ? 'Yes' : 'No'}</td>
                      <td style={cellStyle}>
                        {tx.base64Attachment ? (
                          <a 
                            href={URL.createObjectURL(new Blob([Buffer.from(tx.base64Attachment, 'base64')], {type: 'image/png'}))}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            View Attachment
                          </a>
                        ) : (
                          'No Attachment'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTransactions.length === 0 && <p>No transactions found.</p>}
            </>
          } />
          <Route path="/add" element={<AddTransaction />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
