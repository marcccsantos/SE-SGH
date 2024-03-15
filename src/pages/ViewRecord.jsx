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
  const [selectedColumns, setSelectedColumns] = useState([]); 
  const [popupTimeout, setPopupTimeout] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState({
    firstName: true,
    middleName: true,
    contactNumber: true,
    email: true,
    dateOfBirth: true,
    age: true,
    gender: true,
    street: true,
    city: true,
    province: true,
    barangay: true,
    lotNumber: true,
    department: true,
    position: true,
    dateHired: true,
    salaryPerMonth: true,
    tin: true,
    prc: true,
    prcExpiry: true,
    sss: true,
    sssDeduction: true,
    philhealth: true,
    philhealthDeduction: true,
    pagibig: true,
    pagibigDeduction: true,
    id: false, // Hide ID column
    status: false, // Hide STATUS column
    role: false, // Hide ROLE column
    imageUrl: false // Hide IMAGEURL column
  });

  const staticColumnOrder = [
    'employeeID',
    'lastName',
    'firstName',
    'middleName',
    'contactNumber',
    'email',
    'dateOfBirth',
    'age',
    'gender',
    'street',
    'city',
    'province',
    'barangay',
    'lotNumber',
    'department',
    'position',
    'dateHired',
    'salaryPerMonth',
    'tin',
    'prc',
    'prcExpiry',
    'sss',
    'sssDeduction',
    'philhealth',
    'philhealthDeduction',
    'pagibig',
    'pagibigDeduction'
  ];

  const rowHeight = 100; // Adjust this value based on your row height

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

  useEffect(() => {
    handleQuickSort(quickFilter);
  }, [quickFilter, sortOrder]); // Listen for changes in quickFilter or sortOrder

  useEffect(() => {
    let timeoutId;

    const handleTimeout = () => {
      setShowOptions(false); // Hide popup content
    };

    const resetTimeout = () => {
      clearTimeout(timeoutId); // Clear previous timeout
      timeoutId = setTimeout(handleTimeout, 5000); // Set new timeout
    };

    const handleDocumentClick = (event) => {
      if (!event.target.classList.contains('popup-content')) {
        resetTimeout(); // Reset timeout when clicking outside the popup content
      }
    };

    if (selectedRecord) {
      // Initialize timeout on component mount or when selectedRecord changes
      resetTimeout();
    }

    // Set timeout for popup content to disappear when selectedRecord changes or component unmounts
    document.addEventListener('click', handleDocumentClick);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [selectedRecord]);

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
      // Initialize column visibility state
      const initialColumnVisibility = {};
      Object.keys(paddedRecords[0] || {}).forEach(column => {
        initialColumnVisibility[column] = true;
      });
      setColumnVisibility(initialColumnVisibility);
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
      const valueA = typeof a[column] === 'string' ? a[column].toLowerCase() : a[column];
      const valueB = typeof b[column] === 'string' ? b[column].toLowerCase() : b[column];

      if (sortOrder === 'asc') {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      } else {
        if (valueA > valueB) return -1;
        if (valueA < valueB) return 1;
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
      // Start the countdown
      startCountdown();
    } 
  };


  const startCountdown = () => {
    clearTimeout(popupTimeout); // Clear existing timeout
    const timeout = setTimeout(() => {
      setSelectedRecord(null); // Hide the popup
    }, 5000); // 5 seconds timeout
    setPopupTimeout(timeout); // Save the timeout ID
  };

  // Effect to clear the countdown when the component unmounts or a new row is clicked
  useEffect(() => {
    return () => {
      clearTimeout(popupTimeout); // Clear the timeout
    };
  }, [popupTimeout]);


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
  


  const handleColumnToggle = (column) => {
    setColumnVisibility(prevVisibility => ({
      ...prevVisibility,
      [column]: !prevVisibility[column]
    }));
  };

  
  
  const columnSelectors = [
    {
      label: 'Personal',
      columns: [
        'firstName',
        'middleName',
        'contactNumber',
        'email',
        'dateOfBirth',
        'age',
        'gender'
      ]
    },
    {
      label: 'Address',
      columns: [
        'street',
        'city',
        'province',
        'barangay',
        'lotNumber'
      ]
    },
    {
      label: 'Employment',
      columns: [
        'department',
        'position',
        'dateHired',
        'salaryPerMonth'
      ]
    },
    {
      label: 'GovIDs',
      columns: [
        'tin',
        'prc',
        'prcExpiry',
        'sss',
        'sssDeduction',
        'philhealth',
        'philhealthDeduction',
        'pagibig',
        'pagibigDeduction'
      ]
    }
  ];

  
  return (
    <>
      <Header />
      <div className="view-record-container">
      <div className="view-record-search">
  <div className="search-controls">
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

  <div className="view-record-controls">
    <div className="column-controls">
      <select
        className="view-record-input1"
        onChange={(e) => {
          setQuickFilter(e.target.value);
          handleQuickSort(e.target.value); // Trigger sorting when sorting option changes
        }}
      >
       <option value="">Sort</option>          
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
    
      <select
        className="view-record-input2"
        onChange={(e) => handleSortOrderChange(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
    
    <div className="checkbox-controls">
      <div className="flex flex-row justify-center">
        {columnSelectors.map((group, index) => (
          <div key={index} className="checkbox-wrapper-3">
            <input
              type="checkbox"
              id={`cbx-${index}`}
              onChange={() => {
                group.columns.forEach((col) => handleColumnToggle(col));
              }}
              checked={!group.columns.some((col) => !columnVisibility[col])}
              className="hidden"
            />
            <label htmlFor={`cbx-${index}`} className="toggle text-base sm:text-xl3 ml-2 cursor-pointer select-none">
              <span className="w-4 h-4 border border-gray-400 rounded-md mr-2 flex-shrink-0"></span>
              {group.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="view-record-table">
            <thead>
              <tr>
                {staticColumnOrder.map((column, index) => (
                  columnVisibility[column] && (
                    <th key={index}>{column.toUpperCase()}</th>
                  )
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
      {staticColumnOrder.map((column, index) => (
        columnVisibility[column] && (
          <td key={index} style={{ textTransform: 'capitalize' }}>{record[column] || '\u00A0'}</td>
        )
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
