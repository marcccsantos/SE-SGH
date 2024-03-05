import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';

const EmployeePayroll = () => {
  const location = useLocation();
  const loggedInEmployeeID = location.state && location.state.loggedInEmployeeID;
  const [payrollData, setPayrollData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null); 
  const [showTable, setShowTable] = useState(false);
  const [generateAllEmployees, setGenerateAllEmployees] = useState(false);
  const [employeeID, setEmployeeID] = useState(loggedInEmployeeID || ''); // Set initial state to loggedInEmployeeID or ''
  const [exportable, setExportable] = useState(false);

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

  const handleGeneratePayroll = async () => {
    try {
      if (!startDate || !endDate) {
        console.error('Please select both start and end dates.');
        return;
      }

    // Check if neither checkbox for generating all employees is checked
    if (!generateAllEmployees) {
        // If employeeID is empty, return an error
        if (!employeeID) {
          console.error('Please specify an Employee ID.');
          return;
        }
      }

      let employeesQuery;
      if (generateAllEmployees) {
        employeesQuery = collection(db, 'employees_active');
      } else {
        employeesQuery = query(collection(db, 'employees_active'), where("employeeID", "==", employeeID));
      }

      const employeesSnapshot = await getDocs(employeesQuery);
      const activeEmployeesData = employeesSnapshot.docs.map(doc => doc.data());

      if (generateAllEmployees && activeEmployeesData.length === 0) {
        console.error('No active employees found.');
        return;
      }

      const extrasQuery = query(collection(db, 'extras_and_deductions'));
      const extrasSnapshot = await getDocs(extrasQuery);
      const extrasData = extrasSnapshot.docs.map(doc => doc.data());

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
          where("employeeID", "==", loggedInEmployeeID)
        );
      }

      const recordsSnapshot = await getDocs(recordsQuery);
      const recordsData = recordsSnapshot.docs.map(doc => doc.data());

      const payrollData = {};

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

      extrasData.forEach(item => {
        const employeeID = item.employeeID;
        if (payrollData[employeeID]) {
          payrollData[employeeID].totalExtras += item.extras || 0;
          payrollData[employeeID].totalDeductions += item.deductions || 0;
        }
      });

      const processedData = Object.values(payrollData).map(employee => {
        const salaryPerMonth = activeEmployeesData.find(item => item.employeeID === employee.employeeID)?.salaryPerMonth || 0;
        const hourlyBasic = (salaryPerMonth / (18 * 8)) || 0;
       
        const grossPay = (hourlyBasic * employee.hoursWorked) || 0;

        const pagibigDeductionPercentage = activeEmployeesData.find(item => item.employeeID === employee.employeeID)?.pagibigDeduction || 0;
        const pagibigDeduction = grossPay * (pagibigDeductionPercentage / 100);
        
        const philhealthDeductionPercentage = activeEmployeesData.find(item => item.employeeID === employee.employeeID)?.philhealthDeduction || 0;
        const philhealthDeduction = grossPay * (philhealthDeductionPercentage / 100);
        
        const sssDeductionPercentage = activeEmployeesData.find(item => item.employeeID === employee.employeeID)?.sssDeduction || 0;
        const sssDeduction = grossPay * (sssDeductionPercentage / 100);

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
      setExportable(true); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateChange = (event, type) => {
    const selectedDate = event.target.value;
    if (type === "start") {
      setStartDate(selectedDate);
    } else if (type === "end") {
      setEndDate(selectedDate);
    }
  };

  const handleExportToExcel = () => {
    const filename = `Payroll_Summary_Report_${startDate}_to_${endDate}.xlsx`;
    const exportData = [];

    exportData.push([`Payroll Summary Report for ${startDate} up to ${endDate}`]);
    exportData.push([]);

    const headers = [
      'Employee ID', 'Last Name', 'Salary Per Month', 'Extras', 'Deductions',
      'Total Hours', 'Gross Pay', 'Pag-IBIG', 'PhilHealth', 'SSS', 'Net Pay'
    ];
    exportData.push(headers);

    payrollData.forEach(item => {
      exportData.push([
        item.employeeID, item.lastName, item.salaryPerMonth, item.extras,
        item.deductions, item.totalHours, item.grossPay, item.pagibigDeduction,
        item.philhealthDeduction, item.sssDeduction, item.netPay
      ]);
    });

    const totals = calculateTotals(payrollData);
    exportData.push(['Total Employees', payrollData.length]);
    exportData.push(['Total Gross Pay', totals.totalGrossPay.toFixed(2)]);
    exportData.push(['Total Net Pay', totals.totalNetPay.toFixed(2)]);

    const ws = XLSX.utils.aoa_to_sheet(exportData);

    const headerCellStyle = { font: { bold: true }, fill: { fgColor: { rgb: "FFFF00" } } };
    const dataCellStyle = { font: { sz: 12 } };

    const range = XLSX.utils.decode_range(ws['!ref']); 
    for(let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "3"; 
      if(!ws[address]) continue; 
      ws[address].s = headerCellStyle;
    }

    for(let R = range.s.r; R <= range.e.r; ++R) {
      for(let C = range.s.c; C <= range.e.c; ++C) {
        if(R < 3) continue; 
        const cellRef = XLSX.utils.encode_cell({r: R, c: C});
        if(ws[cellRef]) ws[cellRef].s = dataCellStyle;
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Data");

    XLSX.writeFile(wb, filename);
  };

  return (
    <div>
      <h1>Employee Payroll</h1>
      <div>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => handleDateChange(e, "start")} />
      </div>
      <div>
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => handleDateChange(e, "end")} />
      </div>
      <div>
        <input type="checkbox" checked={generateAllEmployees} onChange={() => {
          setGenerateAllEmployees(!generateAllEmployees);
          setEmployeeID("");
        }} />
        <label>Generate All Employees</label>
      </div>
      <div>
        <label>Employee ID:</label>
        <input type="text" value={loggedInEmployeeID} readOnly/>
      </div>
      <button onClick={handleGeneratePayroll}>Generate Payroll</button>
      {showTable && (
        <table>
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
      {showTable && payrollData.length > 0 && (
        <div>
          <p>Total number of employees: {payrollData.length}</p>
          {generateAllEmployees && (
            <p>Total Gross Pay: {calculateTotals(payrollData).totalGrossPay.toFixed(2)}</p>
          )}
          <p>Total Net Pay: {calculateTotals(payrollData).totalNetPay.toFixed(2)}</p>
        </div>
      )}
      {exportable && (
        <button onClick={handleExportToExcel}>Export to Excel</button>
      )}
    </div>
  );
};

export default EmployeePayroll;
