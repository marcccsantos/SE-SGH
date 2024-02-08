import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const DTR = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [lastName, setLastName] = useState('');
  const [timeIn, setTimeIn] = useState(null);
  const [timeOut, setTimeOut] = useState(null);

  const handleTimeIn = async () => {
    // Check if the user exists in the employees collection
    const employeesCollection = collection(db, 'employees');
    const employeesQuery = query(
      employeesCollection,
      where('employeeID', '==', parseInt(employeeID, 10)),
      where('lastName', '==', lastName)
    );
    const employeesSnapshot = await getDocs(employeesQuery);
  
    if (employeesSnapshot.empty) {
      console.log('User does not exist.');
      return;
    }
  
    // Check if the user has already timed in today
    const dtrCollection = collection(db, 'daily_time_records');
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const dtrQuery = query(
      dtrCollection,
      where('employeeID', '==', parseInt(employeeID, 10)),
      where('date', '==', dateString)
    );
    const dtrSnapshot = await getDocs(dtrQuery);
  
    if (dtrSnapshot.empty) {
      // User has not timed in today, proceed with time in
      const timeInData = {
        employeeID: parseInt(employeeID, 10),
        lastName,
        date: dateString,
        timeIn: today.toLocaleTimeString(),
      };
  
      const docRef = await addDoc(dtrCollection, timeInData);
      console.log('Time In recorded:', docRef.id);
      setTimeIn(timeInData.timeIn);
    } else {
      console.log('User has already timed in today.');
    }
  };
  
  const handleTimeOut = async () => {
    // Check if the user exists in the employees collection
    const employeesCollection = collection(db, 'employees');
    const employeesQuery = query(
      employeesCollection,
      where('employeeID', '==', parseInt(employeeID, 10)),
      where('lastName', '==', lastName)
    );
    const employeesSnapshot = await getDocs(employeesQuery);
  
    if (employeesSnapshot.empty) {
      console.log('User does not exist.');
      return;
    }
  
    // Check if the user has already timed out today
    const dtrCollection = collection(db, 'daily_time_records');
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const dtrQuery = query(
      dtrCollection,
      where('employeeID', '==', parseInt(employeeID, 10)),
      where('date', '==', dateString)
    );
    const dtrSnapshot = await getDocs(dtrQuery);
  
    if (!dtrSnapshot.empty && !dtrSnapshot.docs[0].data().timeOut) {
      // User has not timed out today, proceed with time out
      const docId = dtrSnapshot.docs[0].id;
      const timeOutData = {
        timeOut: today.toLocaleTimeString(),
      };
  
      await updateDoc(doc(dtrCollection, docId), timeOutData);
      console.log('Time Out recorded:', docId);
      setTimeOut(timeOutData.timeOut);
    } else {
      console.log('User has already timed out today or has not timed in.');
    }
  };

  return (
    <div>
      <h1>Daily Time Record</h1>
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
      <br />
      <label>
        Last Name:
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </label>
      <br />
      <button onClick={handleTimeIn}>Time In</button>
      <button onClick={handleTimeOut}>Time Out</button>

      {timeIn && <p>Time In: {timeIn}</p>}
      {timeOut && <p>Time Out: {timeOut}</p>}
    </div>
  );
};

export default DTR;
