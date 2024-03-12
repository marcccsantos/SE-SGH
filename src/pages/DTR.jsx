import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './DTR.css'; 

const DTR = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [lastName, setLastName] = useState('');
  const [timeIn, setTimeIn] = useState(null);
  const [timeOut, setTimeOut] = useState(null);
  const [showPopupTimeIn, setShowPopupTimeIn] = useState(false);
  const [showPopupTimeOut, setShowPopupTimeOut] = useState(false);

  const handleTimeIn = async () => {
    // Check if the user exists in the employees collection
    const employeesCollection = collection(db, 'employees_active');
    const employeesQuery = query(
      employeesCollection,
      where('employeeID', '==', employeeID),
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
      where('employeeID', '==', employeeID),
      where('date', '==', dateString)
    );
    const dtrSnapshot = await getDocs(dtrQuery);
  
    if (dtrSnapshot.empty) {
      // User has not timed in today, proceed with time in
      const timeInData = {
        employeeID,
        lastName,
        date: dateString,
        timeIn: today.toLocaleTimeString(),
      };
  
      const docRef = await addDoc(dtrCollection, timeInData);
      console.log('Time In recorded:', docRef.id);
      setTimeIn(timeInData.timeIn);
      handleOpenPopupTimeIn();
      setEmployeeID('');
      setLastName('');
    } else {
      console.log('User has already timed in today.');
    }
  };
  
  const handleTimeOut = async () => {
    // Check if the user exists in the employees collection
    const employeesCollection = collection(db, 'employees_active');
    const employeesQuery = query(
        employeesCollection,
        where('employeeID', '==', employeeID),
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
        where('employeeID', '==', employeeID),
        where('date', '==', dateString)
    );
    const dtrSnapshot = await getDocs(dtrQuery);

    if (!dtrSnapshot.empty && !dtrSnapshot.docs[0].data().timeOut) {
        // User has not timed out today, proceed with time out
        const docId = dtrSnapshot.docs[0].id;
        const timeOutData = {
            timeOut: today.toLocaleTimeString(),
        };

        const timeInString = dtrSnapshot.docs[0].data().timeIn;
        const timeInDate = new Date(today.toDateString() + ' ' + timeInString);
        const timeOutDate = today;
        const workHours = calculateWorkHours(timeInDate, timeOutDate);

        timeOutData.totalHours = workHours;

        await updateDoc(doc(dtrCollection, docId), timeOutData);
        console.log('Time Out recorded:', docId);
        setTimeOut(timeOutData.timeOut);
        handleOpenPopupTimeOut();
        setEmployeeID('');
        setLastName('');
    } else if (!dtrSnapshot.empty && dtrSnapshot.docs[0].data().timeOut) {
        // User has already timed out today, check for overnight shift
        const docId = dtrSnapshot.docs[0].id;
        const timeOutData = {
            timeOut: today.toLocaleTimeString(),
        };

        const timeInString = dtrSnapshot.docs[0].data().timeIn;
        const timeInDate = new Date(today.toDateString() + ' ' + timeInString);
        const timeOutDate = today;
        const workHours = calculateWorkHours(timeInDate, timeOutDate);

        timeOutData.totalHours = workHours;

        await updateDoc(doc(dtrCollection, docId), timeOutData);
        console.log('Time Out recorded for overnight shift:', docId);
        setTimeOut(timeOutData.timeOut);
        handleOpenPopupTimeOut();
        setEmployeeID('');
        setLastName('');
    } else {
        console.log('User has already timed out today or has not timed in.');
    }
};

const calculateWorkHours = (timeInDate, timeOutDate) => {
  const workDayStart = new Date(timeInDate);
  workDayStart.setHours(7, 0, 0); // Set work day start time to 7:00 AM
  const workDayEnd = new Date(timeInDate);
  workDayEnd.setHours(7, 0, 0); // Set work day end time to 7:00 AM of the next day

  let workHours = 0;

  // Calculate work hours for the first day
  if (timeOutDate <= workDayEnd) {
      workHours += (timeOutDate - timeInDate) / (1000 * 60 * 60); // Calculate difference in hours
  } else {
      // User worked past midnight
      const firstDayEnd = new Date(timeInDate);
      firstDayEnd.setHours(23, 59, 59); // Set the end of the first day to 11:59:59 PM
      workHours += (firstDayEnd - timeInDate) / (1000 * 60 * 60); // Calculate work hours for the first day
  }

  // Calculate work hours for the second day (if applicable)
  if (timeOutDate > workDayEnd) {
      const secondDayStart = new Date(timeOutDate);
      secondDayStart.setHours(0, 0, 0); // Set the start of the second day to 12:00:00 AM
      workHours += (timeOutDate - secondDayStart) / (1000 * 60 * 60); // Calculate work hours for the second day
  }

  return Math.round(workHours);
};



  useEffect(() => {
    document.body.classList.add('dtrPage');

    return () => {
      document.body.classList.remove('dtrPage');
    };
  }, []); 

  const handleOpenPopupTimeIn = () => {
    setShowPopupTimeIn(true); 
    setTimeout(() => {
      setShowPopupTimeIn(false); 
    }, 5000);
  };
  const handleOpenPopupTimeOut = () => {
    setShowPopupTimeOut(true); 
    setTimeout(() => {
      setShowPopupTimeOut(false); 
    }, 5000);
  };

  const handleClosePopupTimeIn = () => {
    setShowPopupTimeIn(false); 
    setTimeout(() => {
      setShowPopupTimeIn(false); 
    }, 5000);
  };
  const handleClosePopupTimeOut = () => {
    setShowPopupTimeOut(false); 
    setTimeout(() => {
      setShowPopupTimeOut(false); 
    }, 5000);
  };

  return (
    <div className="dtr-container">
      <div className="dtr-card">
        <h1 className="dtr-heading">Daily Time Record</h1>
          <div className="dtr-form">
            <input
              className="dtr-input"
              id="employeeID" 
              type="text"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
              pattern="\d*"
              title="Please enter only numbers"
              placeholder="Employee ID"
            />
            <input 
              className="dtr-input" 
              id="lastName"
              type="text" value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              placeholder="Last Name"  
            />
            <button className="dtr-button" onClick={handleTimeIn}>Time In</button>
            <button className="dtr-button" onClick={handleTimeOut}>Time Out</button>
          </div>
       
      </div>
      {showPopupTimeIn && (
        <div className="popup">
          <div className="popup-content">
            {timeIn && (
              <React.Fragment>
                <h1>Welcome!</h1>
                <p className="text-popup">Time In: {timeIn}</p>
              </React.Fragment>
            )}
            <button className="btn-close" onClick={handleClosePopupTimeIn}>Close</button>
          </div>
        </div>
      )}
      {showPopupTimeOut && (
        <div className="popup">
          <div className="popup-content">
            {timeOut && (
              <React.Fragment>
                <h1>Thank you</h1>
                <p className="text-popup">Time Out: {timeOut}</p>
              </React.Fragment>
            )}
            <button className="btn-close" onClick={handleClosePopupTimeOut}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DTR;
