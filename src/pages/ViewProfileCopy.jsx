import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Import your Firestore and Storage instances



const ViewProfile = () => {
  const { employeeID } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [newImage, setNewImage] = useState(null); // New state to hold newly uploaded image
  const [age, setAge] = useState('');


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

  useEffect(() => {
    // Calculate age when date of birth changes
    if (employeeData && employeeData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(employeeData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setAge(age.toString()); // Update age state
    }
  }, [employeeData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // If a new image is uploaded, upload it to Firebase Storage
      let imageUrl = employeeData.imageUrl; // By default, keep the existing image URL
      if (newImage) {
        const filename = `${employeeID.trim()}`;
        const imageRef = ref(storage, `employees_pictures/${filename}`);
        await uploadBytes(imageRef, newImage);
        imageUrl = await getDownloadURL(imageRef); // Update imageUrl with the new URL
      }

    // Calculate age based on date of birth if it's edited
    let updatedAge = age;
    if (editedData.dateOfBirth && editedData.dateOfBirth !== employeeData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(editedData.dateOfBirth);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      updatedAge = calculatedAge;
    }

    // Convert age to number
    updatedAge = parseInt(updatedAge, 10);

      // Update Firestore document with new data including the updated age
      const employeeRef = doc(db, 'employees_active', documentId);
      await updateDoc(employeeRef, { ...editedData, age: updatedAge, imageUrl });
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file); // Store the newly uploaded image
    }
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
      <div>
        <label>Middle Name:</label>
        <input type="text" value={isEditing ? editedData.middleName : employeeData.middleName} readOnly={!isEditing} name="middleName" onChange={handleChange} />
      </div>
      <div>
        <label>Province:</label>
        <input type="text" value={isEditing ? editedData.province : employeeData.province} readOnly={!isEditing} name="province" onChange={handleChange} />
      </div>
      <div>
        <label>City:</label>
        <input type="text" value={isEditing ? editedData.city : employeeData.city} readOnly={!isEditing} name="city" onChange={handleChange} />
      </div>
      <div>
        <label>Barangay:</label>
        <input type="text" value={isEditing ? editedData.barangay : employeeData.barangay} readOnly={!isEditing} name="barangay" onChange={handleChange} />
      </div>
      <div>
        <label>Street:</label>
        <input type="text" value={isEditing ? editedData.street : employeeData.street} readOnly={!isEditing} name="street" onChange={handleChange} />
      </div>
      <div>
        <label>Lot Number:</label>
        <input type="text" value={isEditing ? editedData.lotNumber : employeeData.lotNumber} readOnly={!isEditing} name="lotNumber" onChange={handleChange} />
      </div>
      <div>
        <label>Email:</label>
        <input type="text" value={isEditing ? editedData.email : employeeData.email} readOnly={!isEditing} name="email" onChange={handleChange} />
      </div>
      <div>
        <label>Contact Number:</label>
        <input type="text" value={isEditing ? editedData.contactNumber : employeeData.contactNumber} readOnly={!isEditing} name="contactNumber" onChange={handleChange} />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input type="date" value={isEditing ? editedData.dateOfBirth : employeeData.dateOfBirth} readOnly={!isEditing} name="dateOfBirth" onChange={handleChange} />
      </div>
      <div>
        <label>Age:</label>
        <input type="number" value={age} readOnly/>      
      </div>
      <div>
        <label>Gender:</label>
          <select value={isEditing ? editedData.gender : employeeData.gender} onChange={(e) => handleChange(e)} disabled={!isEditing} name="gender">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label>Department:</label>
        <input
          type="text"
          value={isEditing ? editedData.department : employeeData.department}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="department"
        />
      </div>
      <div>
        <label>Position:</label>
        <input
          type="text"
          value={isEditing ? editedData.position : employeeData.position}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="position"
        />
      </div>
      <div>
        <label>Date Hired:</label>
        <input
          type="date"
          value={isEditing ? editedData.dateHired : employeeData.dateHired}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="dateHired"
        />
      </div>
      <div>
        <label>Employment Status:</label>
        <select
          value={isEditing ? editedData.status : employeeData.status}
          onChange={(e) => handleChange(e)}
          disabled={!isEditing}
          name="status"
        >
          <option value="">Select Status</option>
          <option value="Regular">Regular</option>
          <option value="Contractual">Contractual</option>
        </select>
      </div>
      <div>
        <label>Salary Per Month:</label>
        <input
          type="number"
          value={isEditing ? editedData.salaryPerMonth : employeeData.salaryPerMonth}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="salaryPerMonth"
        />
      </div>
      <div>
        <label>PRC:</label>
        <input
          type="text"
          value={isEditing ? editedData.prc : employeeData.prc}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="prc"
        />
      </div>
      <div>
        <label>PRC Expiry:</label>
        <input
          type="date"
          value={isEditing ? editedData.prcExpiry : employeeData.prcExpiry}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="prcExpiry"
        />
      </div>
      <div>
        <label>TIN:</label>
        <input
          type="text"
          value={isEditing ? editedData.tin : employeeData.tin}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="tin"
        />
      </div>
      <div>
        <label>SSS:</label>
        <input
          type="text"
          value={isEditing ? editedData.sss : employeeData.sss}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="sss"
        />
      </div>
      <div>
        <label>SSS Deduction:</label>
        <input
          type="number"
          value={isEditing ? editedData.sssDeduction : employeeData.sssDeduction}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="sssDeduction"
        />
      </div>
      <div>
        <label>Philhealth:</label>
        <input
          type="text"
          value={isEditing ? editedData.philhealth : employeeData.philhealth}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="philhealth"
        />
      </div>
      <div>
        <label>Philhealth Deduction:</label>
        <input
          type="number"
          value={isEditing ? editedData.philhealthDeduction : employeeData.philhealthDeduction}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="philhealthDeduction"
        />
      </div>
      <div>
        <label>Pagibig:</label>
        <input
          type="text"
          value={isEditing ? editedData.pagibig : employeeData.pagibig}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="pagibig"
        />
      </div>
      <div>
        <label>Pagibig Deduction:</label>
        <input
          type="number"
          value={isEditing ? editedData.pagibigDeduction : employeeData.pagibigDeduction}
          onChange={(e) => handleChange(e)}
          readOnly={!isEditing}
          name="pagibigDeduction"
          // Ensure the value is between 0 and 100
          min="0"
          max="100"
        />
      </div>

      {/* Display image */}
      <div>
        <label>Image:</label>
        {isEditing ? (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        ) : (
          <img src={employeeData.imageUrl} alt="Employee" style={{ maxWidth: '200px' }} />
        )}
      </div>

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
