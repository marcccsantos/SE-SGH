import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';
import './Payroll.css'; // Import Payroll CSS file
// Import Header and Footer components
import Header from '../components/header';
import Footer from '../components/footer';

const Payroll = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [lastName, setLastName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalHours, setTotalHours] = useState(null);
  const [payrollData, setPayrollData] = useState([]);
  const [isGeneratingPayroll, setIsGeneratingPayroll] = useState(false);
  const [generateForAllEmployees, setGenerateForAllEmployees] = useState(false);

  useEffect(() => {
    const fetchTotalHours = async () => {
      // Fetch daily time records based on the selected criteria
      const dtrCollection = collection(db, 'daily_time_records');
      let dtrQuery = dtrCollection;

      // Add filters based on user inputs
      if (generateForAllEmployees) {
        // If generating for all employees, no need for individual filters
      } else {
        if (employeeID) {
          dtrQuery = query(dtrQuery, where('employeeID', '==', parseInt(employeeID, 10)));
        }
        if (lastName) {
          dtrQuery = query(dtrQuery, where('lastName', '==', lastName));
        }
      }

      if (startDate && endDate) {
        // Format the startDate and endDate to match Firestore date format (YYYY-MM-DD)
        const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
        const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
        dtrQuery = query(dtrQuery, 
          where('date', '>=', formattedStartDate),
          where('date', '<=', formattedEndDate)
        );
      }

      const dtrSnapshot = await getDocs(dtrQuery);

      // Calculate total hours and generate payroll data
      const payrollData = {};
      let totalHours = 0;
      dtrSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.timeIn && data.timeOut) {
          const timeIn = new Date(data.date + ' ' + data.timeIn);
          const timeOut = new Date(data.date + ' ' + data.timeOut);
          const hoursWorked = (timeOut - timeIn) / (1000 * 60 * 60);
          totalHours += hoursWorked;
          if (payrollData[data.employeeID]) {
            payrollData[data.employeeID].hoursWorked += hoursWorked;
          } else {
            payrollData[data.employeeID] = {
              employeeID: data.employeeID,
              lastName: data.lastName,
              hoursWorked,
            };
          }
        }
      });

      setTotalHours(totalHours);
      setPayrollData(Object.values(payrollData));
      setIsGeneratingPayroll(false); // Reset flag after generating payroll
    };

    if ((generateForAllEmployees || (employeeID || lastName)) && (startDate && endDate)) {
      fetchTotalHours();
    }
  }, [employeeID, lastName, startDate, endDate, generateForAllEmployees]);

  const generatePayroll = () => {
    setIsGeneratingPayroll(true);
  };

  const savePayrollToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(payrollData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payroll');
    XLSX.writeFile(workbook, 'payroll.xlsx');
  };

  return (
    <div>
      <h1>Payroll</h1>
      <label>
        Employee ID:
        <input
          type="text"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          pattern="\d*"
          title="Please enter only numbers"
          disabled={generateForAllEmployees}
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={generateForAllEmployees}
        />
      </label>
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <label>
        Generate for all employees:
        <input
          type="checkbox"
          checked={generateForAllEmployees}
          onChange={(e) => setGenerateForAllEmployees(e.target.checked)}
        />
      </label>
      <button onClick={generatePayroll}>Generate Payroll</button>
      {isGeneratingPayroll && (
        <div>
          <h2>Payroll Data</h2>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Last Name</th>
                <th>Total Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((data, index) => (
                <tr key={index}>
                  <td>{data.employeeID}</td>
                  <td>{data.lastName}</td>
                  <td>{data.hoursWorked.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={savePayrollToExcel}>Save as Excel</button>
        </div>
      )}
      {totalHours !== null && !isGeneratingPayroll && (
        <p>Total Hours: {totalHours.toFixed(2)} hours</p>
      )}
    </div>
  );
};

export default Payroll;
