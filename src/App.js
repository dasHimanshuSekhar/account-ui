import React, { useEffect, useState } from 'react';

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
    fetch('https://01de893a-a4b9-4c34-933f-7d799abd96a7.e1-us-east-azure.choreoapps.dev/exp/fetch-transactions')
      .then((response) => response.json())
      .then((data) => {
        console.log('API response:', data);
        setStatusDesc(data.statusDesc);
        setTransactions(data.detailedTransactions);
      })
      .catch((error) => console.error('API fetch error:', error));
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
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: isDarkMode ? '#3e4451' : '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    color: isDarkMode ? '#fff' : '#282c34',
  };

  const headerRowStyle = {
    backgroundColor: '#4CAF50',
    color: '#fff',
  };

  const headerStyle = {
    border: '1px solid #4CAF50',
    padding: '12px',
    textAlign: 'left',
    cursor: 'pointer',
  };

  const rowStyle = {
    backgroundColor: isDarkMode ? '#4b5263' : '#f9f9f9',
  };

  const cellStyle = {
    border: '1px solid #4CAF50',
    padding: '10px',
  };

  return (
    <div className="App" style={appStyle}>
      <h1>Transaction List</h1>
      <button onClick={() => setIsDarkMode(!isDarkMode)}>Toggle Theme</button>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange}
          style={{ padding: '8px', margin: '5px' }}
        />

        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          style={{ padding: '8px', margin: '5px' }}
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
          style={{ padding: '8px', margin: '5px' }}
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
          style={{ padding: '8px', margin: '5px' }}
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
          style={{ padding: '8px', margin: '5px' }}
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
          style={{ padding: '8px', margin: '5px' }}
        />
        <input
          type="number"
          name="amountMax"
          placeholder="Max Amount"
          value={filters.amountMax}
          onChange={handleFilterChange}
          style={{ padding: '8px', margin: '5px' }}
        />

        <input
          type="date"
          name="dateMin"
          placeholder="Min Date"
          value={filters.dateMin}
          onChange={handleFilterChange}
          style={{ padding: '8px', margin: '5px' }}
        />
        <input
          type="date"
          name="dateMax"
          placeholder="Max Date"
          value={filters.dateMax}
          onChange={handleFilterChange}
          style={{ padding: '8px', margin: '5px' }}
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
            </tr>
          ))}
        </tbody>
      </table>
      {filteredTransactions.length === 0 && <p>No transactions found.</p>}
    </div>
  );
}

export default App;
