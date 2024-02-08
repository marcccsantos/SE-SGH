import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance

const ViewRecord = () => {
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [quickFilter, setQuickFilter] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      setRecords(results);
      setFilteredRecords(results);
      setSelectedColumns(Object.keys(results[0] || {}));
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchInput.trim() === '') {
        setFilteredRecords(records);
      } else {
        const results = records.filter((record) =>
          Object.values(record).some((value) =>
            String(value).toLowerCase().includes(searchInput.toLowerCase())
          )
        );
        setFilteredRecords(results);
      }
    } catch (error) {
      console.error('Error searching records:', error);
    }
  };

  const handleQuickSort = (column) => {
    const sortedRecords = [...filteredRecords].sort((a, b) => {
      if (sortOrder === 'asc') {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      } else {
        if (a[column] > b[column]) return -1;
        if (a[column] < b[column]) return 1;
        return 0;
      }
    });
    setFilteredRecords(sortedRecords);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  const handleColumnSelect = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  return (
    <div>
      <h1>View Records</h1>
      <div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <select onChange={(e) => setQuickFilter(e.target.value)}>
          <option value="">Quick Sort</option>
          <option value="employeeID">Employee ID</option>
          <option value="lastName">Last Name</option>
          {/* Add more options for other columns */}
        </select>
        <button onClick={() => handleQuickSort(quickFilter)}>Apply Quick Sort</button>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="sortOrder"
            value="asc"
            checked={sortOrder === 'asc'}
            onChange={() => handleSortOrderChange('asc')}
          />
          Ascending
        </label>
        <label>
          <input
            type="radio"
            name="sortOrder"
            value="desc"
            checked={sortOrder === 'desc'}
            onChange={() => handleSortOrderChange('desc')}
          />
          Descending
        </label>
      </div>
      <div>
        {/* Render checkboxes for selecting columns */}
        {Object.keys(filteredRecords[0] || {}).map((column) => (
          <label key={column}>
            <input
              type="checkbox"
              checked={selectedColumns.includes(column)}
              onChange={() => handleColumnSelect(column)}
            />
            {column}
          </label>
        ))}
      </div>
      <div>
        {/* Display filtered and sorted content in a table */}
        <table>
          <thead>
            <tr>
              {selectedColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={index}>
                {selectedColumns.map((column) => (
                  <td key={`${column}-${index}`}>{record[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewRecord;
