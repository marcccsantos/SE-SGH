import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';


const PayrollFinal = () => {
  // State variables to hold data from Firestore collections
  const [payrollData, setPayrollData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showTable, setShowTable] = useState(false); // State variable to control table visibility
  const [generateAllEmployees, setGenerateAllEmployees] = useState(false); // State variable to control if all employees should be generated
  const [employeeID, setEmployeeID] = useState(""); // State variable to hold employee ID for individual payroll
  const [exportable, setExportable] = useState(false); // State variable to control export button visibility

  // Function to calculate total gross pay and total net pay
  const calculateTotals = (data) => {
    let totalGrossPay = 0;
    let totalNetPay = 0;

    data.forEach((item) => {
      if (!isNaN(parseFloat(item.grossPay))) {
        totalGrossPay += parseFloat(item.grossPay);
      }
      if (!isNaN(parseFloat(item.netPay))) {
        totalNetPay += parseFloat(item.netPay);
      }
    });

    return { totalGrossPay, totalNetPay };
  };

  // Function to handle "Generate Payroll" button click
  const handleGeneratePayroll = async () => {
    try {
      if (!startDate || !endDate) {
        console.error('Please select both start and end dates.');
        return;
      }

      // Check if neither checkbox for generating all employees is checked nor specific employee ID is provided
      if (!generateAllEmployees && !employeeID) {
        console.error('Please choose either "Generate All Employees" or specify an Employee ID.');
        return;
      }

      // Reset employeeID if generating all employees
      if (generateAllEmployees) {
        setEmployeeID("");
      }

      // Construct the query based on the selection
      let employeesQuery;
      if (generateAllEmployees) {
        employeesQuery = collection(db, 'employees_active');
      } else {
        employeesQuery = query(collection(db, 'employees_active'), where("employeeID", "==", employeeID));
      }

      const employeesSnapshot = await getDocs(employeesQuery);
      const activeEmployeesData = employeesSnapshot.docs.map(doc => doc.data()); // Use const instead of let

      if (generateAllEmployees && activeEmployeesData.length === 0) {
        console.error('No active employees found.');
        return;
      }

      // Fetch extras and deductions
      const extrasQuery = query(collection(db, 'extras_and_deductions'));
      const extrasSnapshot = await getDocs(extrasQuery);
      const extrasData = extrasSnapshot.docs.map(doc => doc.data());

      // Fetch daily time records within the selected date range
      let recordsQuery;
      if (generateAllEmployees) {
        recordsQuery = query(collection(db, 'daily_time_records'), 
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        );
      } else {
        recordsQuery = query(collection(db, 'daily_time_records'), 
          where("date", ">=", startDate),
          where("date", "<=", endDate),
          where("employeeID", "==", employeeID)
        );
      }

      const recordsSnapshot = await getDocs(recordsQuery);
      const recordsData = recordsSnapshot.docs.map(doc => doc.data());

      const payrollData = {};

      // Populate payroll data based on fetched information
      recordsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (typeof data.employeeID === 'string' && data.timeIn && data.timeOut) {
          const employeeID = data.employeeID;
          if (!payrollData[employeeID]) {
            payrollData[employeeID] = {
              employeeID: employeeID,
              lastName: data.lastName,
              hoursWorked: 0,
              totalExtras: 0,
              totalDeductions: 0
            };
          }
          payrollData[employeeID].hoursWorked += data.totalHours || 0;
        }
      });

      // Calculate total extras and deductions for each employee
      extrasData.forEach(item => {
        const employeeID = item.employeeID;
        if (payrollData[employeeID]) {
          payrollData[employeeID].totalExtras += item.extras || 0;
          payrollData[employeeID].totalDeductions += item.deductions || 0;
        }
      });

      // Process payroll data for display
      const processedData = Object.values(payrollData).map(employee => {
        const salaryPerMonth = activeEmployeesData.find(item => item.employeeID === employee.employeeID)?.salaryPerMonth || 0; // Retrieving salaryPerMonth
        const hourlyBasic = (salaryPerMonth / (18 * 8)) || 0;
       
        const grossPay = (hourlyBasic * employee.hoursWorked) || 0;

        // Calculating deductions for each employee
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
      setShowTable(true);
      setExportable(true); // Enable export button
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to handle date selection
  const handleDateChange = (event, type) => {
    const selectedDate = event.target.value;
    if (type === "start") {
      setStartDate(selectedDate);
    } else if (type === "end") {
      setEndDate(selectedDate);
    }
  };

// Function to export data to Excel with styling
const handleExportToExcel = () => {
  const filename = `Payroll_Summary_Report_${startDate}_to_${endDate}.xlsx`;
  const exportData = [];

  exportData.push([`Payroll Summary Report for ${startDate} up to ${endDate}`]);
  exportData.push([]); // Empty row for spacing

  // Headers
  const headers = [
    'Employee ID', 'Last Name', 'Salary Per Month', 'Extras', 'Deductions',
    'Total Hours', 'Gross Pay', 'Pag-IBIG', 'PhilHealth', 'SSS', 'Net Pay'
  ];
  exportData.push(headers);

  // Data rows
  payrollData.forEach(item => {
    exportData.push([
      item.employeeID, item.lastName, item.salaryPerMonth, item.extras,
      item.deductions, item.totalHours, item.grossPay, item.pagibigDeduction,
      item.philhealthDeduction, item.sssDeduction, item.netPay
    ]);
  });

  // Summary rows with total gross and net pay
  const totals = calculateTotals(payrollData); // Utilize your calculateTotals function here
  exportData.push(['Total Employees', payrollData.length]);
  exportData.push(['Total Gross Pay', totals.totalGrossPay.toFixed(2)]);
  exportData.push(['Total Net Pay', totals.totalNetPay.toFixed(2)]);

  // Convert data to worksheet
  const ws = XLSX.utils.aoa_to_sheet(exportData);

  // Apply styles
  const headerCellStyle = { font: { bold: true }, fill: { fgColor: { rgb: "FFFF00" } } }; // Yellow background for headers
  const dataCellStyle = { font: { sz: 12 } }; // Font size 12 for data cells

  // Applying styles to headers
  const range = XLSX.utils.decode_range(ws['!ref']); // Get range of cells in the worksheet
  for(let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "3"; // Headers are on the third row due to the title and spacing
    if(!ws[address]) continue; // If the cell doesn't exist, skip
    ws[address].s = headerCellStyle;
  }

  // Apply data cell style throughout (optional, can be targeted to specific columns)
  for(let R = range.s.r; R <= range.e.r; ++R) {
    for(let C = range.s.c; C <= range.e.c; ++C) {
      if(R < 3) continue; // Skip title and header rows
      const cellRef = XLSX.utils.encode_cell({r: R, c: C});
      if(ws[cellRef]) ws[cellRef].s = dataCellStyle;
    }
  }

  // Create workbook and add worksheet with styles
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Payroll Data");

  // Save workbook with styles
  XLSX.writeFile(wb, filename);
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
      {/* Checkbox for generating all employees */}
      <div>
        <input type="checkbox" checked={generateAllEmployees} onChange={() => {
          setGenerateAllEmployees(!generateAllEmployees);
          setEmployeeID(""); // Reset employee ID when toggling generate all employees
        }} />
        <label>Generate All Employees</label>
      </div>
      {/* Input for specific employee ID */}
      <div>
        <label>Employee ID:</label>
        <input type="text" value={employeeID} onChange={(e) => {
          setEmployeeID(e.target.value);
          setGenerateAllEmployees(false); // Disable generate all employees when specifying employee ID
        }} disabled={generateAllEmployees} />
      </div>
      {/* "Generate Payroll" button */}
      <button onClick={handleGeneratePayroll}>Generate Payroll</button>
      {/* Display payroll table */}
      {showTable && (
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
      )}
      {/* Additional information below the table */}
      {showTable && payrollData.length > 0 && (
        <div>
          <p>Total number of employees: {payrollData.length}</p>
          {generateAllEmployees && (
            <p>Total Gross Pay: {calculateTotals(payrollData).totalGrossPay.toFixed(2)}</p>
          )}
          <p>Total Net Pay: {calculateTotals(payrollData).totalNetPay.toFixed(2)}</p>
        </div>
      )}
      {/* Export to Excel button */}
      {exportable && (
        <button onClick={handleExportToExcel}>Export to Excel</button>
      )}
    </div>
  );
};

export default PayrollFinal;
