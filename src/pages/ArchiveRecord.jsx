import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc} from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance
import Header from '../components/header';
import Footer from '../components/footer';
import './ViewRecord.css'; // Import the CSS file
import { useParams, useNavigate } from 'react-router-dom'; // Import useHistory

const ArchiveRecord= () => {
  const { searchQuery } = useParams();
  const [searchInput, setSearchInput] = useState('');
  const [quickFilter, setQuickFilter] = useState('');
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
  const [selectedRecord, setSelectedRecord] = useState(null);


  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
        try {
            if (!searchQuery || searchQuery.trim() === '') {
                // If searchQuery is empty, reset filteredRecords to show all records
                setFilteredRecords(records);
            } else {
                // Perform search based on searchQuery
                const results = records.filter((record) =>
                    Object.values(record).some((value) =>
                        String(value).toLowerCase().includes(searchQuery.toLowerCase())
                    )
                );
                setFilteredRecords(results);
            }
        } catch (error) {
            console.error('Error searching records:', error);
        }
    };

    performSearch();
}, [searchQuery, records]); // Added 'records' as a dependency


const fetchRecords = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'employees_archive'));
    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Include document ID in the data object
      return { id: doc.id, ...data };
    });
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

  const handleRowClick = (record) => {
    setSelectedRecord(record);
  };

  //TO BE EDITED
  const handleEdit = () => {
    // Check if a record is selected
    if (selectedRecord) {
      // Open ViewProfile page in a new tab with the employeeID of the selected record
      window.open(`/ViewProfile/${selectedRecord.employeeID}`, '_blank');
    } else {
      console.error('No record selected for editing');
    }
  };

  const handleUnarchive = async () => {
    try {
      // Check if a record is selected
      if (selectedRecord) {
        // Get the document ID of the selected record
        const documentId = selectedRecord.id;
  
        console.log('Selected Record:', selectedRecord);

  
        // Check if the record already exists in the destination collection
        const archiveRecordRef = doc(db, 'employees_active', documentId);
        const archiveRecordSnapshot = await getDoc(archiveRecordRef);
        if (archiveRecordSnapshot.exists()) {
          console.error('Record already exists in the active collection.');
          return;
        }
  
        // Get a reference to the selected record in the active collection
        const activeRecordRef = doc(db, 'employees_archive', documentId);
        const activeRecordSnapshot = await getDoc(activeRecordRef);
        
        // Check if the selected record exists in the active collection
        if (!activeRecordSnapshot.exists()) {
          console.error('Selected record does not exist in the current collection.');
          return;
        }
  
        // Retrieve the data of the selected record
        const recordData = activeRecordSnapshot.data();
  
        // Set the record data in the archive collection using the same document ID
        await setDoc(archiveRecordRef, recordData);
  
        // Delete the record from the archive collection
        await deleteDoc(activeRecordRef);
  
        console.log('Record successfully unarchived.');
      // Fetch records again to update UI
      fetchRecords();
      } else {
        console.error('No record selected for unarchiving');
      }
    } catch (error) {
      console.error('Error unarchiving record:', error);
    }
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
            placeholder="Search Archive"
          />
          <button className="view-record-button" onClick={handleSearch}>Search</button>
        </div>
        <div className="view-record-sort">
          <select className="view-record-input1" onChange={(e) => setQuickFilter(e.target.value)}>
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
          <select className="view-record-input2" onChange={(e) => handleSortOrderChange(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button className="view-record-button" onClick={() => handleQuickSort(quickFilter)}>Sort</button>
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
                <tr
                key={rowIndex}
                className={Object.values(record).every(value => !value) ? "empty-row" : ""}
                onClick={() => handleRowClick(record)}
              >                  {[ 'employeeID', 'lastName', 'firstName', 'middleName', 'gender', 'birthday', 'address', 'contactNumber', 'employmentStatus', 'position', 'designation', 'salaryPerMonth', 'department', 'dateHired', 'prc', 'prcExpiry', 'philhealth', 'pagibig', 'sss' ].map((field, colIndex) => (
                    <td key={colIndex} style={{ width: 'calc(100% / 19)' }}>{record[field] || "\u00A0"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedRecord && (
        <div className="popup-modal">
          <div className="popup-content">
            <h2>Options for Record</h2>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleUnarchive}>Unarchive</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ArchiveRecord;
