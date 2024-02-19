import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';

const PayrollFinal = () => {
  // State variables to hold data from Firestore collections
  const [payrollData, setPayrollData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!startDate || !endDate) return; // Don't fetch data if dates are not selected

        const employeesQuery = query(collection(db, 'employees_active'));
        const employeesSnapshot = await getDocs(employeesQuery);
        const activeEmployeesData = employeesSnapshot.docs.map(doc => doc.data());
  
        const extrasQuery = query(collection(db, 'extras_and_deductions'));
        const extrasSnapshot = await getDocs(extrasQuery);
        const extrasData = extrasSnapshot.docs.map(doc => doc.data());
  
        const recordsQuery = query(collection(db, 'daily_time_records'), 
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        );
        const recordsSnapshot = await getDocs(recordsQuery);
        const recordsData = recordsSnapshot.docs.map(doc => doc.data());
  
        const payrollData = {};
        const totalExtras = {};
        const totalDeductions = {};
        const totalHours = {};
  
        extrasData.forEach(item => {
          const employeeID = item.employeeID;
          if (!totalExtras[employeeID]) {
            totalExtras[employeeID] = 0;
          }
          totalExtras[employeeID] += item.extras || 0;
        });
  
        extrasData.forEach(item => {
          const employeeID = item.employeeID;
          if (!totalDeductions[employeeID]) {
            totalDeductions[employeeID] = 0;
          }
          totalDeductions[employeeID] += item.deductions || 0;
        });
  
        recordsData.forEach(item => {
          const employeeID = item.employeeID;
          if (!totalHours[employeeID]) {
            totalHours[employeeID] = 0;
          }
          totalHours[employeeID] += item.totalHours || 0;
        });
  
        recordsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (typeof data.employeeID === 'string' && data.timeIn && data.timeOut) {
            const employeeID = data.employeeID;
            if (payrollData[employeeID]) {
              payrollData[employeeID].hoursWorked += data.totalHours || 0;
            } else {
              payrollData[employeeID] = {
                employeeID: employeeID,
                lastName: data.lastName,
                hoursWorked: data.totalHours || 0,
                totalExtras: totalExtras[employeeID] || 0,
                totalDeductions: totalDeductions[employeeID] || 0,
              };
            }
          }
        });
  
        const processedData = Object.values(payrollData).map(employee => {
          const salaryPerMonth = activeEmployeesData.find(item => item.employeeID === employee.employeeID)?.salaryPerMonth || 0; // Retrieving salaryPerMonth
          const hourlyBasic = (salaryPerMonth / (18 * 8)) || 0;
         
          const grossPay = (hourlyBasic * employee.hoursWorked) || 0;

          const pagibigDeductionPercentage = activeEmployeesData.find(item => item.employeeID === employee.employeeID)?.pagibigDeduction || 0; // Retrieving pagibig deduction percentage
          const pagibigDeduction = grossPay * (pagibigDeductionPercentage / 100); // Calculating pagibig deduction amount
          
          const philhealthDeductionPercentage = activeEmployeesData.find(item => item.employeeID === employee.employeeID)?.philhealthDeduction || 0; // Retrieving philhealth deduction percentage
          const philhealthDeduction = grossPay * (philhealthDeductionPercentage / 100); // Calculating philhealth deduction amount
          
          const sssDeductionPercentage = activeEmployeesData.find(item => item.employeeID === employee.employeeID)?.sssDeduction || 0; // Retrieving SSS deduction percentage
          const sssDeduction = grossPay * (sssDeductionPercentage / 100); // Calculating SSS deduction amount

          // Calculate net pay
          const netPay = grossPay + employee.totalExtras - employee.totalDeductions - pagibigDeduction - philhealthDeduction - sssDeduction;

          console.log("Employee ID:", employee.employeeID, "Salary Per Month:", salaryPerMonth);
          return {
            employeeID: employee.employeeID,
            lastName: employee.lastName,
            salaryPerMonth: salaryPerMonth,
            extras: employee.totalExtras,
            deductions: employee.totalDeductions,
            totalHours: employee.hoursWorked.toFixed(2),
            grossPay: isNaN(grossPay) ? 'N/A' : grossPay.toFixed(2),
            pagibigDeduction: isNaN(pagibigDeduction) ? 'N/A' : pagibigDeduction.toFixed(2),
            philhealthDeduction: isNaN(philhealthDeduction) ? 'N/A' : philhealthDeduction.toFixed(2),
            sssDeduction: isNaN(sssDeduction) ? 'N/A' : sssDeduction.toFixed(2),
            netPay: isNaN(netPay) ? 'N/A' : netPay.toFixed(2) 
          };
        });
  
        setPayrollData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [startDate, endDate]);
  
  // Function to handle date selection
  const handleDateChange = (event, type) => {
    const selectedDate = event.target.value;
    if (type === "start") {
      setStartDate(selectedDate);
    } else if (type === "end") {
      setEndDate(selectedDate);
    }
  };
  

  return (
    <div>
      <h1>Payroll Data</h1>
      {/* Date selection */}
      <div>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => handleDateChange(e, "start")} />
      </div>
      <div>
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => handleDateChange(e, "end")} />
      </div>
      {/* Display payroll table */}
      <table>
        {/* Table headers */}
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Last Name</th>
            <th>Salary Per Month</th>
            <th>Extras</th>
            <th>Deductions</th>
            <th>Total Hours</th>
            <th>Gross Pay</th>
            <th>Pag-IBIG</th>
            <th>PhilHealth</th>
            <th>SSS</th>
            <th>Net Pay</th>
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
              <td>{data.grossPay}</td>
              <td>{data.pagibigDeduction}</td>
              <td>{data.philhealthDeduction}</td>
              <td>{data.sssDeduction}</td>
              <td>{data.netPay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollFinal;
