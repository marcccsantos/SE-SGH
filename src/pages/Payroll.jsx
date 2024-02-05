import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

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
    <div>
      <h1>Total Hours</h1>
      <label>
        Employee ID:
        <input
          type="text"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          pattern="\d*"
          title="Please enter only numbers"
        />
      </label>
      {totalHours !== null && <p>Total Hours: {totalHours.toFixed(2)} hours</p>}
    </div>
  );
};

export default Payroll;
