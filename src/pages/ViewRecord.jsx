import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance
import Header from '../components/header';
import Footer from '../components/footer';
import './ViewRecord.css'; // Import the CSS file

const ViewRecord = () => {
  const [searchInput, setSearchInput] = useState('');
  const [quickFilter, setQuickFilter] = useState('');
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

  // Function to generate empty cells with the same width as non-empty cells
  const generateEmptyCells = (record) => {
    const keys = Object.keys(record);
    const emptyCells = [];

    for (let i = 0; i < keys.length; i++) {
      emptyCells.push(<td key={i}>&nbsp;</td>);
    }

    return emptyCells;
  };

  return (
    <>
      <Header />
      <div className="view-record-container">
        <div className="view-record-search">
          <input
            className="view-record-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
          />
          <button className="view-record-button" onClick={handleSearch}>Search</button>
        </div>
        <div className="view-record-sort">
          <select className="view-record-input" onChange={(e) => setQuickFilter(e.target.value)}>
            <option value="">Quick Sort</option>
            <option value="employeeID">Employee ID</option>
            <option value="lastName">Last Name</option>
            <option value="firstName">First Name</option>
            <option value="middleName">Middle Name</option>
            <option value="gender">Gender</option>
            <option value="birthday">Birthday</option>
            <option value="address">Address</option>
            <option value="contactNumber">Contact Number</option>
            <option value="status">Status</option>
            <option value="position">Position</option>
            <option value="designation">Designation</option>
            <option value="salaryperMonth">SalaryperMonth</option>
            <option value="department">Department</option>
            <option value="hireDate">Hire Date</option>
            <option value="PRC">PRC</option>
            <option value="PRCExpiry">PRC Expiry</option>
            <option value="philhealth">philhealth</option>
            <option value="pagibig">pagibig</option>
            <option value="sss">sss</option>
          </select>
          <select className="view-record-input" onChange={(e) => handleSortOrderChange(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button className="view-record-button" onClick={() => handleQuickSort(quickFilter)}>Apply Quick Sort</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {/* Display filtered and sorted content in a table */}
          <table className="view-record-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Gender</th>
                <th>Birthday</th>
                <th>Address</th>
                <th>Contact Number</th>
                <th>Status</th>
                <th>Position</th>
                <th>Designation</th>
                <th>SalaryperMonth</th>
                <th>Department</th>
                <th>Hire Date</th>
                <th>PRC</th>
                <th>PRC Expiry</th>
                <th>Philhealth</th>
                <th>Pagibig</th>
                <th>SSS</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(20)].map((_, index) => (
                <tr key={index}>
                  {filteredRecords[index] ? (
                    Object.values(filteredRecords[index]).map((value, colIndex) => (
                      <td key={colIndex}>{value}</td>
                    ))
                  ) : (
                    generateEmptyCells(filteredRecords[0])
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewRecord;
