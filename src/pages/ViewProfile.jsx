import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance

const ViewProfile = () => {
  const { employeeID } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeQuery = query(collection(db, 'employees_active'), where('employeeID', '==', employeeID));
        const querySnapshot = await getDocs(employeeQuery);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setEmployeeData(docData);
          setEditedData({ ...docData }); // Initialize editedData with employeeData
          setDocumentId(querySnapshot.docs[0].id); // Set the document ID
        } else {
          console.error('No employee found with the provided ID');
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
  }, [employeeID]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const employeeRef = doc(db, 'employees_active', documentId); // Use the stored document ID
      await updateDoc(employeeRef, editedData);
      setIsEditing(false);
      console.log('Employee data updated successfully');
    } catch (error) {
      console.error('Error updating employee data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  if (!employeeData) {
    return <div>Loading...</div>;
  }

  return (
    <form>
      <div>
        <label>Employee ID:</label>
        <input type="text" value={employeeData.employeeID} readOnly />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" value={isEditing ? editedData.lastName : employeeData.lastName} readOnly={!isEditing} name="lastName" onChange={handleChange} />
      </div>
      <div>
        <label>First Name:</label>
        <input type="text" value={isEditing ? editedData.firstName : employeeData.firstName} readOnly={!isEditing} name="firstName" onChange={handleChange} />
      </div>
      {/* Include other input fields for displaying other employee data */}

      {isEditing ? (
        <div>
          <button type="button" onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <button type="button" onClick={handleEdit}>Edit</button>
        </div>
      )}
    </form>
  );
};

export default ViewProfile;
