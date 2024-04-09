import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Import your Firestore instance
import Header from "../components/header";
import Footer from "../components/footer";
import "./ViewRecord.css"; // Import the CSS file
import { useParams } from "react-router-dom"; // Import useParams only, since useHistory is not used
import { CiSearch } from "react-icons/ci";

const ViewRecord = () => {
  const { searchQuery } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [quickFilter, setQuickFilter] = useState("employeeID");
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showOptions, setShowOptions] = useState(false); // State to control display of options
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
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
    imageUrl: false, // Hide IMAGEURL column
  });

  const staticColumnOrder = [
    "employeeID",
    "lastName",
    "firstName",
    "middleName",
    "contactNumber",
    "email",
    "dateOfBirth",
    "age",
    "gender",
    "street",
    "city",
    "province",
    "barangay",
    "lotNumber",
    "department",
    "position",
    "dateHired",
    "salaryPerMonth",
    "tin",
    "prc",
    "prcExpiry",
    "sss",
    "sssDeduction",
    "philhealth",
    "philhealthDeduction",
    "pagibig",
    "pagibigDeduction",
  ];

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      try {
        if (!searchQuery || searchQuery.trim() === "") {
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
        console.error("Error searching records:", error);
      }
    };

    performSearch();
  }, [searchQuery, records]);

  useEffect(() => {
    const padFilteredRecords = () => {
      const remainingRows = 12 - filteredRecords.length;
      if (remainingRows > 0) {
        const paddedRecords = [...filteredRecords];
        for (let i = 0; i < remainingRows; i++) {
          paddedRecords.push({});
        }
        setFilteredRecords(paddedRecords);
      }
    };

    padFilteredRecords();
  }, [filteredRecords]);

  useEffect(() => {
    handleQuickSort(quickFilter);
  }, [quickFilter, sortOrder]); // Listen for changes in quickFilter or sortOrder

  useEffect(() => {
    const fetchRecordsAndApplyDefaultSorting = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "employees_active"));
        const results = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Include document ID in the data object
          return { id: doc.id, ...data };
        });
        const uniqueRecords = filterUniqueRecords(results);
        const paddedRecords = padRecords(uniqueRecords, 12); // Pad with empty records if less than 12

        // Apply default sorting by EmployeeID in ascending order
        const sortedRecords = [...paddedRecords].sort((a, b) => {
          return a.employeeID - b.employeeID;
        });

        setRecords(sortedRecords);
        setFilteredRecords(sortedRecords);
        setSelectedColumns(Object.keys(paddedRecords[0] || {})); // Initialize selected columns with all columns

        // Initialize column visibility state
        const initialColumnVisibility = {};
        Object.keys(paddedRecords[0] || {}).forEach((column) => {
          initialColumnVisibility[column] = true;
        });
        setColumnVisibility(initialColumnVisibility);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecordsAndApplyDefaultSorting(); // Fetch records and apply default sorting
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        event.target.closest(".popup-content") ||
        event.target.closest(".view-record-table")
      ) {
        return;
      }
      setSelectedRecord(null);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const fetchRecords = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees_active"));
      const results = querySnapshot.docs.map((doc) => {
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
      Object.keys(paddedRecords[0] || {}).forEach((column) => {
        initialColumnVisibility[column] = true;
      });
      setColumnVisibility(initialColumnVisibility);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const filterUniqueRecords = (records) => {
    const uniqueIds = new Set();
    return records.filter((record) => {
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
      if (searchInput.trim() === "") {
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
      console.error("Error searching records:", error);
    }
  };

  const handleQuickSort = (column) => {
    const sortedRecords = [...filteredRecords].sort((a, b) => {
      const valueA =
        typeof a[column] === "string" ? a[column].toLowerCase() : a[column];
      const valueB =
        typeof b[column] === "string" ? b[column].toLowerCase() : b[column];

      if (sortOrder === "asc") {
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
    if (
      Object.values(clickedRecord).some(
        (value) => value !== undefined && value !== null
      )
    ) {
      setSelectedRecord(clickedRecord);
      setSelectedRowIndex(rowIndex);
    } else {
      setSelectedRecord(null);
    }
  };

  const handleEdit = () => {
    // Check if a record is selected
    if (selectedRecord) {
      // Open ViewProfile page in a new tab with the employeeID of the selected record
      window.open(`/ViewProfile/${selectedRecord.employeeID}`, "_blank");
    } else {
      console.error("No record selected for editing");
    }
  };

  const handleArchive = async () => {
    try {
      // Check if a record is selected
      if (selectedRecord) {
        // Get the document ID of the selected record
        const documentId = selectedRecord.id;

        console.log("Selected Record:", selectedRecord);

        // Check if the record already exists in the archive
        const archiveRecordRef = doc(db, "employees_archive", documentId);
        const archiveRecordSnapshot = await getDoc(archiveRecordRef);
        if (archiveRecordSnapshot.exists()) {
          console.error("Record already exists in the archive.");
          return;
        }

        // Get a reference to the selected record in the active collection
        const activeRecordRef = doc(db, "employees_active", documentId);
        const activeRecordSnapshot = await getDoc(activeRecordRef);

        // Check if the selected record exists in the active collection
        if (!activeRecordSnapshot.exists()) {
          console.error(
            "Selected record does not exist in the current collection."
          );
          return;
        }

        // Retrieve the data of the selected record
        const recordData = activeRecordSnapshot.data();

        // Set the record data in the archive collection using the same document ID
        await setDoc(archiveRecordRef, recordData);

        // Delete the record from the active collection
        await deleteDoc(activeRecordRef);

        console.log("Record successfully archived.");
        // Fetch records again to update UI
        fetchRecords();
      } else {
        console.error("No record selected for archiving");
      }
    } catch (error) {
      console.error("Error archiving record:", error);
    }
  };

  const handleColumnToggle = (column) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [column]: !prevVisibility[column],
    }));
  };

  const [confirmationAction, setConfirmationAction] = useState(null); // State to track the action requiring confirmation

  const handleConfirmation = (action) => {
    setConfirmationAction(action); // Set the action requiring confirmation
  };

  const confirmAction = (action) => {
    if (action === "edit") {
      handleEdit();
    } else if (action === "archive") {
      handleArchive();
    }
    setConfirmationAction(null); // Reset confirmation action after handling
  };

  const columnSelectors = [
    {
      label: "Personal",
      columns: [
        "firstName",
        "middleName",
        "contactNumber",
        "email",
        "dateOfBirth",
        "age",
        "gender",
      ],
    },
    {
      label: "Address",
      columns: ["street", "city", "province", "barangay", "lotNumber"],
    },
    {
      label: "Employment",
      columns: ["department", "position", "dateHired", "salaryPerMonth"],
    },
    {
      label: "GovIDs",
      columns: [
        "tin",
        "prc",
        "prcExpiry",
        "sss",
        "sssDeduction",
        "philhealth",
        "philhealthDeduction",
        "pagibig",
        "pagibigDeduction",
      ],
    },
  ];
  const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-lvh">
        <div>
          <div className=" w-full  mt-5 md:mt-16 flex justify-center items center flex-row">
            <div className=" min-h-full md:flex items-start justify-start flex-col  0 hidden  mt-12">
              <select
                // className="view-record-input1  py-2 px-4  bg-[#176906] hover:bg-[#155e06] text-white border border-black-400 border-l-0 focus:outline-none rounded-md"
                className=" py-3 px-4  bg-[#176906] hover:bg-[#155e06] text-white border border-black-400 border-l-0 focus:outline-none rounded-md  hidden md:block"
                onChange={(e) => {
                  setQuickFilter(e.target.value);
                  handleQuickSort(e.target.value); // Trigger sorting when sorting option changes
                }}
              >
                <option value="employeeID">Employee ID</option>
                <option value="lastName">Last Name</option>
                <option value="firstName">First Name</option>
                <option value="middleName">Middle Name</option>
                <option value="gender">Gender</option>
                <option value="dateOfBirth">Birthday</option>
                <option value="address">Address</option>
                <option value="contactNumber">Contact Number</option>
                <option value="email">Email</option>
                <option value="position">Position</option>
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
                className="w-full mt-2 py-2 px-4 rounded-md bg-[#176906] hover:bg-[#155e06] text-white border border-black-400 border-l-0 focus:outline-none hidden md:block"
                onChange={(e) => handleSortOrderChange(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="flex items-start flex-col">
              <div className="md:mx-16 bg-white flex flex-row justify-center items-center rounded-md text-[12px] md:text-base font-inter shadow-lg pl-2  border border-black">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search Record"
                  className="p-1 px-2 outline-none "
                />

                <button
                  className="bg-[#176906] text-white rounded-md py-2 px-4 hover:bg-[#155e06] ml-2"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>

              <div className="flex justify-center items-start flex-row gap-x-3">
                <div className="">
                  <select
                    className="mt-2 py-2 px-1  bg-[#176906] hover:bg-[#155e06] text-white border border-black-400 border-l-0 focus:outline-none rounded-md text-[12px] block md:hidden"
                    onChange={(e) => {
                      setQuickFilter(e.target.value);
                      handleQuickSort(e.target.value); // Trigger sorting when sorting option changes
                    }}
                  >
                    <option value="employeeID">Employee ID</option>
                    <option value="lastName">Last Name</option>
                    <option value="firstName">First Name</option>
                    <option value="middleName">Middle Name</option>
                    <option value="gender">Gender</option>
                    <option value="dateOfBirth">Birthday</option>
                    <option value="address">Address</option>
                    <option value="contactNumber">Contact Number</option>
                    <option value="email">Email</option>
                    <option value="position">Position</option>
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
                    className="mt-2 py-2 px-4 rounded-md bg-[#176906] hover:bg-[#155e06] text-white text-[12px] border border-black-400 border-l-0 focus:outline-none block md:hidden"
                    onChange={(e) => handleSortOrderChange(e.target.value)}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                <div className="min-h-full  items-end justify-end block md:hidden text-[12px] ml-2 w-[125px]">
                  <div className="py-[6.5px] px-4 rounded-md bg-[#176906] hover:bg-[#155e06] text-white border border-black-400 mt-2">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className=" whitespace-nowrap"
                    >
                      Select Columns
                    </button>
                    {showDropdown && (
                      <div className="dropdown-content">
                        {columnSelectors.map((group, index) => (
                          <div key={index} className="checkbox-wrapper-19">
                            <input
                              type="checkbox"
                              id={`cbx-${index}`}
                              onChange={() => {
                                group.columns.forEach((col) =>
                                  handleColumnToggle(col)
                                );
                              }}
                              checked={
                                !group.columns.some(
                                  (col) => !columnVisibility[col]
                                )
                              }
                              className="hidden"
                            />
                            <label
                              htmlFor={`cbx-${index}`}
                              className="check-box"
                            >
                              <span className="checkbox-label-text">
                                {group.label}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="min-h-full  items-start justify-center   hidden md:block w-[155px] mt-12">
                <div className="py-2 px-4 rounded-md bg-[#176906] hover:bg-[#155e06] text-white border border-black-400">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className=" whitespace-nowrap"
                  >
                    Select Columns
                  </button>
                  {showDropdown && (
                    <div className="dropdown-content">
                      {columnSelectors.map((group, index) => (
                        <div key={index} className="checkbox-wrapper-19">
                          <input
                            type="checkbox"
                            id={`cbx-${index}`}
                            onChange={() => {
                              group.columns.forEach((col) =>
                                handleColumnToggle(col)
                              );
                            }}
                            checked={
                              !group.columns.some(
                                (col) => !columnVisibility[col]
                              )
                            }
                            className="hidden"
                          />
                          <label htmlFor={`cbx-${index}`} className="check-box">
                            <span className="checkbox-label-text">
                              {group.label}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ overflowX: "auto" }}
            className="md:mt-10 mt-5 mx-4 md:mx-8 mb-10"
          >
            <table className="view-record-table">
              <thead>
                <tr>
                  {staticColumnOrder.map(
                    (column, index) =>
                      columnVisibility[column] && (
                        <th key={index}>{column.toUpperCase()}</th>
                      )
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={
                      Object.values(record).every((value) => !value)
                        ? "empty-row"
                        : ""
                    }
                    onClick={() => handleRowClick(rowIndex)}
                    style={{
                      backgroundColor:
                        rowIndex === selectedRowIndex ? "#F9AF40" : "",
                    }}
                  >
                    {staticColumnOrder.map(
                      (column, index) =>
                        columnVisibility[column] && (
                          <td
                            key={index}
                            style={{
                              textTransform:
                                column === "email" ? "lowercase" : "capitalize",
                            }}
                          >
                            {record[column] || "\u00A0"}
                          </td>
                        )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {selectedRecord && !confirmationAction && (
          <div className="popup-container">
            <div className="popup-content">
              <button onClick={() => handleConfirmation("edit")}>Edit</button>
              <button onClick={() => handleConfirmation("archive")}>
                Archive
              </button>
            </div>
            {/* Semi-transparent background only behind popup-content */}
            <div
              className="popup-overlay"
              onClick={() => setSelectedRecord(null)}
            ></div>
          </div>
        )}

        {/* Confirmation dialog */}
        {confirmationAction && (
          <div className="popup-container">
            <div className="confirmation-dialog">
              <p>Are you sure you want to {confirmationAction}?</p>
              <button onClick={() => confirmAction(confirmationAction)}>
                Yes
              </button>
              <button onClick={() => setConfirmationAction(null)}>No</button>
            </div>
            <div
              className="popup-overlay"
              onClick={() => setConfirmationAction(null)}
            ></div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ViewRecord;
