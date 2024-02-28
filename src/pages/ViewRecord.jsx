import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance
import Header from '../components/header';
import Footer from '../components/footer';
import './ViewRecord.css'; // Import the CSS file
import { useParams } from 'react-router-dom'; // Import useParams only, since useHistory is not used

const ViewRecord = () => {
  const { searchQuery } = useParams();
  const [searchInput, setSearchInput] = useState('');
  const [quickFilter, setQuickFilter] = useState('');
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showOptions, setShowOptions] = useState(false); // State to control display of options
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]); // State to store selected columns
  const rowHeight = 50; // Adjust this value based on your row height

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
      const querySnapshot = await getDocs(collection(db, 'employees_active'));
      const results = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Include document ID in the data object
        return { id: doc.id, ...data };
      });
      const uniqueRecords = filterUniqueRecords(results);
      const paddedRecords = padRecords(uniqueRecords, 12); // Pad with empty records if less than 12
      setRecords(paddedRecords);
      setFilteredRecords(paddedRecords);
      setSelectedColumns(Object.keys(paddedRecords[0] || {})); // Initialize selected columns with all columns
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

  const handleRowClick = (rowIndex) => {
    const clickedRecord = filteredRecords[rowIndex];
    // Check if clickedRecord is not empty (i.e., it has at least one value)
    if (Object.values(clickedRecord).some(value => value !== undefined && value !== null)) {
      setSelectedRecord(clickedRecord);
      setSelectedRowIndex(rowIndex);
    }
  };

  const calculatePopupPosition = () => {
    const popupTop = selectedRowIndex * rowHeight + 250; // Add or subtract offset as needed
    return popupTop;
  };

  const handleEdit = () => {
    // Check if a record is selected
    if (selectedRecord) {
      // Open ViewProfile page in a new tab with the employeeID of the selected record
      window.open(`/ViewProfile/${selectedRecord.employeeID}`, '_blank');
    } else {
      console.error('No record selected for editing');
    }
  };

  const handleArchive = async () => {
    try {
      // Check if a record is selected
      if (selectedRecord) {
        // Get the document ID of the selected record
        const documentId = selectedRecord.id;

        console.log('Selected Record:', selectedRecord);

        // Check if the record already exists in the archive
        const archiveRecordRef = doc(db, 'employees_archive', documentId);
        const archiveRecordSnapshot = await getDoc(archiveRecordRef);
        if (archiveRecordSnapshot.exists()) {
          console.error('Record already exists in the archive.');
          return;
        }

        // Get a reference to the selected record in the active collection
        const activeRecordRef = doc(db, 'employees_active', documentId);
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

        // Delete the record from the active collection
        await deleteDoc(activeRecordRef);

        console.log('Record successfully archived.');
        // Fetch records again to update UI
        fetchRecords();
      } else {
        console.error('No record selected for archiving');
      }
    } catch (error) {
      console.error('Error archiving record:', error);
    }
  };

  const handleColumnSelect = (groupName, groupColumns) => {
    if (selectedColumns.some(col => groupColumns.includes(col))) {
      // If any column from the group is already selected, deselect all from the group
      setSelectedColumns(selectedColumns.filter(col => !groupColumns.includes(col)));
    } else {
      // If none of the columns from the group are selected, select all from the group
      setSelectedColumns([...selectedColumns, ...groupColumns]);
    }
  };

  const handleShowAllToggle = (event) => {
    if (event.target.checked) {
      // If "Show All" is checked, select all columns
      setSelectedColumns(Object.keys(paddedRecords[0] || {}));
    } else {
      // If "Show All" is unchecked, deselect all columns
      setSelectedColumns([]);
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
            placeholder="Search Record"
          />
          <button className="view-record-button" onClick={handleSearch}>
            Search
          </button>
        </div>
  
        <div className="view-record-sort">
          <select
            className="view-record-input1"
            onChange={(e) => setQuickFilter(e.target.value)}
          >
             <option value="employeeID">Employee ID</option>
            <option value="lastName">Last Name</option>
            <option value="firstName">First Name</option>
            <option value="middleName">Middle Name</option>
            <option value="gender">Gender</option>
            <option value="dateOfBirth">Birthday</option>
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
        </div>
  
        <div>
          <select
            className="view-record-input2"
            onChange={(e) => handleSortOrderChange(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button
            className="view-record-button"
            onClick={() => handleQuickSort(quickFilter)}
          >
            Sort
          </button>
        </div>
        <div>
           
           <label>
           Personal Information
             <input
               type="checkbox"
               checked={
                 selectedColumns.includes('employeeID') ||
                 selectedColumns.includes('lasttName') ||
                 selectedColumns.includes('firstName') ||
                 selectedColumns.includes('middleName') ||
                 selectedColumns.includes('contactNumber') ||
                 selectedColumns.includes('email') ||
                 selectedColumns.includes('dateOfBirth') ||
                 selectedColumns.includes('age') ||
                 selectedColumns.includes('gender')
               }
               onChange={() =>
                 handleColumnSelect('personal', [
                   'employeeID',
                   'lastName',
                   'firstName',
                   'middleName',
                   'contactNumber',
                   'email',
                   'dateOfBirth',
                   'age',
                   'gender',
                 ])
               }
             />

           </label>
           <label>
           Address Information
             <input
               type="checkbox"
               checked={
                 selectedColumns.includes('previewImage') ||
                 selectedColumns.includes('street') ||
                 selectedColumns.includes('city') ||
                 selectedColumns.includes('province') ||
                 selectedColumns.includes('barangay') ||
                 selectedColumns.includes('lotNumber')
               }
               onChange={() =>
                 handleColumnSelect('address', [
                   'previewImage',
                   'street',
                   'city',
                   'province',
                   'barangay',
                   'lotNumber',
                 ])
               }
             />

           </label>
           <label>
           Employment Information
             <input
               type="checkbox"
               checked={
                 selectedColumns.includes('department') ||
                 selectedColumns.includes('position') ||
                 selectedColumns.includes('dateHired') ||
                 selectedColumns.includes('salaryPerMonth')
               }
               onChange={() =>
                 handleColumnSelect('employment', [
                   'department',
                   'position',
                   'dateHired',
                   'salaryPerMonth',
                 ])
               }
             />

           </label>
           <label>
           Government IDs and Benefits
             <input
               type="checkbox"
               checked={
                 selectedColumns.includes('tin') ||
                 selectedColumns.includes('prc') ||
                 selectedColumns.includes('prcExpiry') ||
                 selectedColumns.includes('sss') ||
                 selectedColumns.includes('sssDeduction') ||
                 selectedColumns.includes('philhealth') ||
                 selectedColumns.includes('philhealthDeduction') ||
                 selectedColumns.includes('pagibig') ||
                 selectedColumns.includes('pagibigDeduction')
               }
               onChange={() =>
                 handleColumnSelect('government', [
                   'tin',
                   'prc',
                   'prcExpiry',
                   'sss',
                   'sssDeduction',
                   'philhealth',
                   'philhealthDeduction',
                   'pagibig',
                   'pagibigDeduction',
                 ])
               }
             />

           </label>
         </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="view-record-table">
            <thead>
              <tr>
                {selectedColumns.map((column) => (
                  // Exclude 'id', 'imageurl', and 'role' from being rendered in the table headers
        (column !== 'id' && column !== 'imageUrl' && column !== 'role' && column !== 'status'  && column !== 'previewImage') &&
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={
                    Object.values(record).every((value) => !value)
                      ? 'empty-row'
                      : ''
                  }
                  onClick={() => handleRowClick(rowIndex)}
                  style={{
                    backgroundColor:
                      rowIndex === selectedRowIndex ? '#F9AF40' : '',
                  }}
                >
                  {selectedColumns.map((field, colIndex) => (
                    // Render table data cells only for columns other than 'id', 'imageurl', and 'role'
          (field !== 'id' && field !== 'imageUrl' && field !== 'role' && field !== 'status'  && field !== 'previewImage') &&
                    <td key={colIndex}>{record[field] || '\u00A0'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {selectedRecord && (
          <div
            className="options-container"
            style={{ top: `${calculatePopupPosition()}px` }}
          >
            <div className="popup-content">
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleArchive}>Archive</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ViewRecord;
