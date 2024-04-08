import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import "./DTR.css";
import { MdError } from "react-icons/md";

const DTR = () => {
  const [employeeID, setEmployeeID] = useState("");
  const [lastName, setLastName] = useState("");
  const [timeIn, setTimeIn] = useState(null);
  const [timeOut, setTimeOut] = useState(null);
  const [showPopupTimeIn, setShowPopupTimeIn] = useState(false);
  const [showPopupTimeOut, setShowPopupTimeOut] = useState(false);
  const [userExistPopUp, setUserExistPopUp] = useState(false);
  const [timedToday, setTimedToday] = useState(false);
  const [timedOutToday, setTimedOutToday] = useState(false);

  const handleTimeIn = async () => {
    // Check if the user exists in the employees collection
    const employeesCollection = collection(db, "employees_active");
    const employeesQuery = query(
      employeesCollection,
      where("employeeID", "==", employeeID),
      where("lastName", "==", lastName)
    );
    const employeesSnapshot = await getDocs(employeesQuery);

    if (employeesSnapshot.empty) {
      console.log("User does not exist.");
      setUserExistPopUp(true);
      return;
    }

    const employeeData = employeesSnapshot.docs[0].data();

    // Retrieve shift information
    const shift = employeeData.shift;

    // Get current time
    const currentTime = new Date();

    // Determine the shift start time based on the shift type
    let shiftStart;

    switch (shift) {
      case "7-5":
        shiftStart = new Date(currentTime);
        shiftStart.setHours(7, 0, 0); // Set shift start time to 7:00 AM
        break;
      case "5-7":
        shiftStart = new Date(currentTime);
        shiftStart.setHours(17, 0, 0); // Set shift start time to 5:00 PM
        break;
      case "8-5":
        shiftStart = new Date(currentTime);
        shiftStart.setHours(8, 0, 0); // Set shift start time to 8:00 AM
        break;
      default:
        console.log("Invalid shift type.");
        return;
    }

    // Calculate grace period end time (15 minutes after the shift start)
    const gracePeriodEndTime = new Date(shiftStart.getTime() + 15 * 60 * 1000); // 15 minutes in milliseconds

    // Check if the user has already timed in today
    const dtrCollection = collection(db, "daily_time_records");
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const dtrQuery = query(
      dtrCollection,
      where("employeeID", "==", employeeID),
      where("date", "==", dateString)
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

      // Check for late arrival
      if (currentTime > gracePeriodEndTime) {
        const lateArrivalMinutes = Math.round(
          (currentTime - gracePeriodEndTime) / (1000 * 60)
        ); // Round off to nearest minute
        const deductionsData = {
          employeeID,
          date: dateString,
          deductions: lateArrivalMinutes,
          deductionsReason: "Late arrival",
        };
        // Log deductions to 'extras_and_deductions' collection
        await addDoc(collection(db, "extras_and_deductions"), deductionsData);
      }

      const docRef = await addDoc(dtrCollection, timeInData);
      console.log("Time In recorded:", docRef.id);
      setTimeIn(timeInData.timeIn);
      handleOpenPopupTimeIn();
      setEmployeeID("");
      setLastName("");
    } else {
      console.log("User has already timed in today.");
      setTimedToday(true);
    }
  };

  const handleTimeOut = async () => {
    // Check if the user exists in the employees collection
    const employeesCollection = collection(db, "employees_active");
    const employeesQuery = query(
      employeesCollection,
      where("employeeID", "==", employeeID),
      where("lastName", "==", lastName)
    );
    const employeesSnapshot = await getDocs(employeesQuery);

    if (employeesSnapshot.empty) {
      console.log("User does not exist.");
      setUserExistPopUp(true);
      return;
    }

    // Check if the user has already timed out today
    const dtrCollection = collection(db, "daily_time_records");
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const dtrQuery = query(
      dtrCollection,
      where("employeeID", "==", employeeID),
      where("date", "==", dateString)
    );
    const dtrSnapshot = await getDocs(dtrQuery);

    if (!dtrSnapshot.empty && !dtrSnapshot.docs[0].data().timeOut) {
      // User has not timed out today, proceed with time out
      const docId = dtrSnapshot.docs[0].id;
      const timeOutData = {
        timeOut: today.toLocaleTimeString(),
      };

      const timeInString = dtrSnapshot.docs[0].data().timeIn;
      const timeInDate = new Date(today.toDateString() + " " + timeInString);
      const timeOutDate = today;
      const workHours = calculateWorkHours(timeInDate, timeOutDate);

      timeOutData.totalHours = workHours;

      await updateDoc(doc(dtrCollection, docId), timeOutData);
      console.log("Time Out recorded:", docId);
      setTimeOut(timeOutData.timeOut);
      handleOpenPopupTimeOut();
      setEmployeeID("");
      setLastName("");
    } else {
      console.log("User has already timed out today or has not timed in.");
      setTimedOutToday(true);
    }
  };

  const calculateWorkHours = (timeInDate, timeOutDate) => {
    // Calculate the time difference in milliseconds
    let timeDifference = timeOutDate - timeInDate;

    // Check if time out is earlier (indicating an overnight shift)
    if (timeDifference < 0) {
      // Add 24 hours to the time difference
      timeDifference += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }

    // Convert milliseconds to hours and minus 1 hour for break
    const workHours = timeDifference / (1000 * 60 * 60) - 1;

    // Rounds up the hours
    return Math.ceil(workHours);
  };

  useEffect(() => {
    document.body.classList.add("dtrPage");

    return () => {
      document.body.classList.remove("dtrPage");
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

  const handleClosePopup = () => {
    setUserExistPopUp(false);
  };

  return (
    <div className="dtr-container">
      <div className="dtr-card">
        <h1 className="dtr-heading font-inter font-bold text-[35px]">
          Daily Time Record
        </h1>
        <div className="dtr-form  font-inter">
          <input
            className="dtr-input border border-black w-full mb-3 p-1 pl-2 rounded text-[13px]"
            id="employeeID"
            type="text"
            value={employeeID}
            onChange={(e) => setEmployeeID(e.target.value)}
            pattern="\d*"
            title="Please enter only numbers"
            placeholder="Employee ID"
          />
          <input
            className="dtr-input border border-black w-full mb-5 p-1 pl-2 rounded text-[13px]"
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <button className="dtr-button mb-2" onClick={handleTimeIn}>
            Time In
          </button>
          <button className="dtr-button" onClick={handleTimeOut}>
            Time Out
          </button>
        </div>
      </div>
      {showPopupTimeIn && (
        <div className="popup">
          <div className="flex justify-center items-center p-10 bg-white flex-col rounded">
            {timeIn && (
              <React.Fragment>
                <h1 className="font-inter font-bold text-[35px] mb-2">
                  Welcome!
                </h1>
                <p className="text-popup">Time In: {timeIn}</p>
              </React.Fragment>
            )}
            <button
              className="bg-[#176906] py-1 px-2 rounded text-white text-sm hover:underline hover:bg-[#155e06]"
              onClick={handleClosePopupTimeIn}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showPopupTimeOut && (
        <div className="popup">
          <div className="flex justify-center items-center p-10 bg-white flex-col rounded">
            {timeOut && (
              <React.Fragment>
                <h1 className="font-inter font-bold text-[35px] mb-2">
                  Goodbye!
                </h1>
                <p className="text-popup">Time Out: {timeOut}</p>
              </React.Fragment>
            )}
            <button
              className="bg-[#176906] py-1 px-2 rounded text-white text-sm hover:underline hover:bg-[#155e06]"
              onClick={handleClosePopupTimeOut}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {userExistPopUp && (
        <div className="bg-[#00000080] w-full h-screen absolute flex justify-center items-center font-inter font-semibold">
          <div className="bg-white flex flex-col p-5 rounded">
            <div className="flex flex-row">
              <MdError className="w-10 h-10 text-red-600" />
              <h1 className="ml-3 mt-2">User does not exists</h1>
            </div>
            <div className="mt-3 flex justify-center ">
              <button
                onClick={handleClosePopup}
                className="border border-black py-1 px-5 rounded text-sm hover:underline "
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {timedToday && (
        <div className="bg-[#00000080] w-full h-screen absolute flex justify-center items-center font-inter font-semibold">
          <div className="bg-white flex flex-col p-5 rounded">
            <div className="flex flex-row">
              <MdError className="w-10 h-10 text-red-600" />
              <h1 className="ml-3 mt-2">User has already timed in today</h1>
            </div>
            <div className="mt-3 flex justify-center ">
              <button
                onClick={() => setTimedToday(false)}
                className="border border-black py-1 px-5 rounded text-sm hover:underline "
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {timedOutToday && (
        <div className="bg-[#00000080] w-full h-screen absolute flex justify-center items-center font-inter font-semibold">
          <div className="bg-white flex flex-col p-5 rounded  w-[350px]">
            <div className="flex flex-row">
              <MdError className="w-[60px] h-[60px] text-red-600" />
              <h1 className="ml-4 mt-2">
                User has already timed out today or has not timed in
              </h1>
              <h1 className="ml-3 mt-2"></h1>
            </div>
            <div className="mt-3 flex justify-center ">
              <button
                onClick={() => setTimedOutToday(false)}
                className="border border-black py-1 px-5 rounded text-sm hover:underline "
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DTR;
