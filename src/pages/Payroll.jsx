import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Payroll.css'; // Import Payroll CSS file

// Import Header and Footer components
import Header from '../components/Header';
import Footer from '../components/Footer';

const Payroll = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [totalHours, setTotalHours] = useState(null);

  useEffect(() => {
    const fetchTotalHours = async () => {
      // Fetch daily time records for the specified employee
      const dtrCollection = collection(db, 'daily_time_records');
      const dtrQuery = query(
        dtrCollection,
        where('employeeID', '==', parseInt(employeeID, 10))
      );
      const dtrSnapshot = await getDocs(dtrQuery);

      // Calculate total hours
      let totalHours = 0;
      dtrSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.timeIn && data.timeOut) {
          const timeIn = new Date(data.date + ' ' + data.timeIn);
          const timeOut = new Date(data.date + ' ' + data.timeOut);
          const hoursWorked = (timeOut - timeIn) / (1000 * 60 * 60);
          totalHours += hoursWorked;
        }
      });

      setTotalHours(totalHours);
    };

    if (employeeID) {
      fetchTotalHours();
    }
  }, [employeeID]);

  return (
    <>
      {/* Include the Header component */}
      <Header />
      
      <div className="payrollTab"> {/* Add a class for styling */}
        <h1>Total Hours</h1>
        <div className="addTab"> {/* Apply styles similar to AddRecord */}

          <div className="add-inputs">
            <label htmlFor="employeeID">Employee ID:</label>
            <input
              type="text"
              id="employeeID"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
              pattern="\d*"
              title="Please enter only numbers"
            />
          </div>
        </div>
        {totalHours !== null && <p>Total Hours: {totalHours.toFixed(2)} hours</p>}
      </div>

      {/* Include the Footer component */}
      <Footer />
    </>
  );
};

export default Payroll;