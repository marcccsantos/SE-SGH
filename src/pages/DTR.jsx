import React, { useState } from 'react';

const DTR = () => {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now.toLocaleTimeString());
    setClockedIn(true);
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockOutTime(now.toLocaleTimeString());
    setClockedIn(false);
  };

  return (
    <div>
      <h1>Daily Time Record</h1>
      {clockedIn ? (
        <div>
          <p>Status: Clocked In</p>
          <p>Time In: {clockInTime}</p>
          <button onClick={handleClockOut}>Clock Out</button>
        </div>
      ) : (
        <div>
          <p>Status: Clocked Out</p>
          <button onClick={handleClockIn}>Clock In</button>
        </div>
      )}
      {clockOutTime && <p>Time Out: {clockOutTime}</p>}
    </div>
  );
};

export default DTR;
