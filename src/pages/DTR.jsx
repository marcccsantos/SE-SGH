import React, { useState } from 'react';

const DTR = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

  const handleClockInOut = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();

    if (isClockedIn) {
      setClockOutTime(formattedTime);
    } else {
      setClockInTime(formattedTime);
    }

    setIsClockedIn(!isClockedIn);
  };

  return (
    <div>
      <h1>Daily Time Record</h1>
      <div>
        <p>Status: {isClockedIn ? 'Clocked In' : 'Clocked Out'}</p>
        {isClockedIn ? <p>Time In: {clockInTime}</p> : null}
        {clockOutTime && <p>Time Out: {clockOutTime}</p>}
        <button onClick={handleClockInOut}>{isClockedIn ? 'Clock Out' : 'Clock In'}</button>
      </div>
    </div>
  );
};

export default DTR;
