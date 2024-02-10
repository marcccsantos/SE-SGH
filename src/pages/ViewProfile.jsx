import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, storage, auth } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './ViewProfile.css'; // Import the CSS file

const ViewProfile = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [employeeData, setEmployeeData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFetchData = async () => {
    const employeesCollection = collection(db, 'employees');
    const employeeQuery = query(employeesCollection, where('employeeID', '==', parseInt(employeeID, 10)));
    const employeeSnapshot = await getDocs(employeeQuery);

    if (!employeeSnapshot.empty) {
      const data = employeeSnapshot.docs[0].data();
      console.log('Employee data found:', data);
      setEmployeeData(data);

      // Fetch and set the image URL
      const imageRef = ref(storage, `employee_picture/${employeeID}`);
      const downloadUrl = await getDownloadURL(imageRef);
      setImageUrl(downloadUrl);
    } else {
      console.log('Employee not found');
      setEmployeeData(null);
      setImageUrl(''); // Reset image URL if employee not found
    }
  };

  return (
    <div className="view-profile-container">
      <h1 className="view-profile-heading">View Employee Profile</h1>
      <label className="view-profile-label">
        Employee ID:
        <input
          className="view-profile-input"
          type="text"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          pattern="\d*"
          title="Please enter only numbers"
        />
      </label>
      <button className="view-profile-button" onClick={handleFetchData}>Fetch Employee Data</button>

      {employeeData && (
        <div className="view-profile-details">
          <h2>Employee Details</h2>
          <p>Employee ID: {employeeData.employeeID}</p>
          <p>Last Name: {employeeData.lastName}</p>
          <p>First Name: {employeeData.firstName}</p>

          {imageUrl && (
            <div className="view-profile-image">
              <h3>Employee Image</h3>
              <img src={imageUrl} alt={`Employee ${employeeID}`} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewProfile;