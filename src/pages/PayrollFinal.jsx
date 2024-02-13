import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';

const PayrollFinal = () => {
  // State variables to hold data from Firestore collections
  const [payrollData, setPayrollData] = useState([]);

  useEffect(() => {
    // Function to fetch data from Firestore collections
    const fetchData = async () => {
        try {
          const employeesQuery = query(collection(db, 'employees_active'));
          const employeesSnapshot = await getDocs(employeesQuery);
          const activeEmployeesData = employeesSnapshot.docs.map(doc => doc.data());
      
          const extrasQuery = query(collection(db, 'extras_and_deductions'));
          const extrasSnapshot = await getDocs(extrasQuery);
          const extrasData = extrasSnapshot.docs.map(doc => doc.data());
      
          const recordsQuery = query(collection(db, 'daily_time_records'));
          const recordsSnapshot = await getDocs(recordsQuery);
          const recordsData = recordsSnapshot.docs.map(doc => doc.data());
      
          // Calculate total hours and generate payroll data
          const payrollData = {};
          const totalExtras = {}; // Object to store total extras for each employee
          const totalDeductions = {}; // Object to store total deductions for each employee
          let totalHours = 0;
      
          // Process extras data to accumulate total extras for each employee
          extrasData.forEach(item => {
            const employeeID = item.employeeID;
            if (!totalExtras[employeeID]) {
              totalExtras[employeeID] = 0;
            }
            totalExtras[employeeID] += item.extras || 0;
          });
      
          // Process deductions data to accumulate total deductions for each employee
          extrasData.forEach(item => {
            const employeeID = item.employeeID;
            if (!totalDeductions[employeeID]) {
              totalDeductions[employeeID] = 0;
            }
            totalDeductions[employeeID] += item.deductions || 0;
          });
      
          // Calculate total hours and generate payroll data
          recordsSnapshot.forEach((doc) => {
            const data = doc.data();
            if (typeof data.employeeID === 'string' && data.timeIn && data.timeOut) {
              const employeeID = data.employeeID;
              const timeIn = new Date(data.date + ' ' + data.timeIn);
              const timeOut = new Date(data.date + ' ' + data.timeOut);
              const hoursWorked = (timeOut - timeIn) / (1000 * 60 * 60);
              totalHours += hoursWorked;
              if (payrollData[employeeID]) {
                payrollData[employeeID].hoursWorked += hoursWorked;
              } else {
                payrollData[employeeID] = {
                  employeeID: employeeID,
                  lastName: data.lastName,
                  hoursWorked: hoursWorked,
                  totalExtras: totalExtras[employeeID] || 0, // Add totalExtras for the employee
                  totalDeductions: totalDeductions[employeeID] || 0, // Add totalDeductions for the employee
                };
              }
            }
          });
      
          // Process the data to create the payrollData array
          const processedData = Object.values(payrollData).map(employee => {
            return {
              employeeID: employee.employeeID,
              lastName: employee.lastName,
              salaryPerMonth: activeEmployeesData.find(item => item.employeeID === employee.employeeID)?.salaryPerMonth || 0,
              extras: employee.totalExtras,
              deductions: employee.totalDeductions,
              totalHours: employee.hoursWorked.toFixed(2), // Convert totalHours to string with 2 decimal places
            };
          });
      
          setPayrollData(processedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      


    // Call the fetchData function
    fetchData();
  }, []);

  return (
    <div>
      <h1>Payroll Data</h1>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Last Name</th>
            <th>Salary Per Month</th>
            <th>Extras</th>
            <th>Deductions</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {payrollData.map((data, index) => (
            <tr key={index}>
              <td>{data.employeeID}</td>
              <td>{data.lastName}</td>
              <td>{data.salaryPerMonth}</td>
              <td>{data.extras}</td>
              <td>{data.deductions}</td>
              <td>{data.totalHours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollFinal;
