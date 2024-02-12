import React, { useState } from 'react';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Import your Firestore and Storage instances

const AddRecordFinal = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeID.trim()) {
      console.error('Employee ID is required');
      return;
    }

    // Check if employeeID already exists
    const employeeQuery = query(collection(db, 'employees_active'), where('employeeID', '==', employeeID.trim()));
    const employeeQuerySnapshot = await getDocs(employeeQuery);
    if (!employeeQuerySnapshot.empty) {
      console.error('Employee ID already exists');
      return;
    }

    try {
        // Set filename to employeeID
        const filename = `${employeeID.trim()}`;
        const imageRef = ref(storage, `employees_pictures/${filename}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
    
        // Add record to Firestore database
        await addDoc(collection(db, 'employees_active'), {
          employeeID: employeeID.trim(),
          lastName,
          dateOfBirth,
          age: parseInt(age, 10),
          gender,
          imageUrl,
        });

      console.log('Record added successfully');
    } catch (error) {
      console.error('Error adding record:', error);
    }

    // Reset form fields
    setEmployeeID('');
    setLastName('');
    setDateOfBirth('');
    setAge('');
    setGender('');
    setImage(null);
    setPreviewImage(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Employee ID:</label>
        <input
          type="text"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value.trim())}
          required
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
      </div>
      {previewImage && (
        <div>
          <label>Preview:</label>
          <img src={previewImage} alt="Preview" style={{ maxWidth: '200px' }} />
        </div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddRecordFinal;
