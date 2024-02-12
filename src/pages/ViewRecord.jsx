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
      const results = querySnapshot.docs.map(doc => doc.data());
      const uniqueRecords = filterUniqueRecords(results);
      const paddedRecords = padRecords(uniqueRecords, 12); // Pad with empty records if less than 12
      setRecords(paddedRecords);
      setFilteredRecords(paddedRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const filterUniqueRecords = (records) => {
    const uniqueIds = new Set();
    return records.filter(record => {
      if (uniqueIds.has(record.employeeID)) {
        return false; // Duplicate record, filter it out
      }
      uniqueIds.add(record.employeeID);
      return true;
    });
  };

  const padRecords = (records, targetLength) => {
    const paddedRecords = [...records];
    while (paddedRecords.length < targetLength) {
      paddedRecords.push({}); // Add empty record
    }
    return paddedRecords;
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
            <option value="employmentStatus">Employment Status</option>
            <option value="position">Position</option>
            <option value="designation">Designation</option>
            <option value="salaryPerMonth">Salary Per Month</option>
            <option value="department">Department</option>
            <option value="dateHired">Date Hired</option>
            <option value="prc">PRC</option>
            <option value="prcExpiry">PRC Expiry</option>
            <option value="philhealth">Philhealth</option>
            <option value="pagibig">Pagibig</option>
            <option value="sss">SSS</option>
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
                <th style={{ width: 'calc(100% / 19)' }}>Employee ID</th>
                <th style={{ width: 'calc(100% / 19)' }}>Last Name</th>
                <th style={{ width: 'calc(100% / 19)' }}>First Name</th>
                <th style={{ width: 'calc(100% / 19)' }}>Middle Name</th>
                <th style={{ width: 'calc(100% / 19)' }}>Gender</th>
                <th style={{ width: 'calc(100% / 19)' }}>Birthday</th>
                <th style={{ width: 'calc(100% / 19)' }}>Address</th>
                <th style={{ width: 'calc(100% / 19)' }}>Contact Number</th>
                <th style={{ width: 'calc(100% / 19)' }}>Employment Status</th>
                <th style={{ width: 'calc(100% / 19)' }}>Position</th>
                <th style={{ width: 'calc(100% / 19)' }}>Designation</th>
                <th style={{ width: 'calc(100% / 19)' }}>Salary Per Month</th>
                <th style={{ width: 'calc(100% / 19)' }}>Department</th>
                <th style={{ width: 'calc(100% / 19)' }}>Date Hired</th>
                <th style={{ width: 'calc(100% / 19)' }}>PRC</th>
                <th style={{ width: 'calc(100% / 19)' }}>PRC Expiry</th>
                <th style={{ width: 'calc(100% / 19)' }}>Philhealth</th>
                <th style={{ width: 'calc(100% / 19)' }}>Pagibig</th>
                <th style={{ width: 'calc(100% / 19)' }}>SSS</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, rowIndex) => (
                <tr key={rowIndex} className={Object.values(record).every(value => !value) ? "empty-row" : ""}>
                  {[ 'employeeID', 'lastName', 'firstName', 'middleName', 'gender', 'birthday', 'address', 'contactNumber', 'employmentStatus', 'position', 'designation', 'salaryPerMonth', 'department', 'dateHired', 'prc', 'prcExpiry', 'philhealth', 'pagibig', 'sss' ].map((field, colIndex) => (
                    <td key={colIndex} style={{ width: 'calc(100% / 19)' }}>{record[field] || "\u00A0"}</td>
                  ))}
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
