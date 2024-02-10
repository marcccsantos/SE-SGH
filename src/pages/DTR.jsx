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
      handleOpenPopupTimeIn();
      setEmployeeID('');
      setLastName('');
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
      handleOpenPopupTimeOut();
      setEmployeeID('');
      setLastName('');
    } else {
      console.log('User has already timed out today or has not timed in.');
    }
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
              type="text"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
              pattern="\d*"
              title="Please enter only numbers"
              placeholder="Employee ID"
            />
            <input 
              className="dtr-input" 
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
