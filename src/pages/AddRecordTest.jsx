import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage, auth } from '../firebase';  // Import your Firestore and Storage instances
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const AddRecordTest = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [salary, setSalary] = useState('');
  const [imageFile, setImageFile] = useState(null); // State to hold the selected image file
  const [imageUrl, setImageUrl] = useState(''); // State to hold the URL of the uploaded image

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!/^\d+$/.test(employeeID)) {
      alert('Employee ID should be a number');
      return;
    }

    if (!/^\d+$/.test(salary)) {
      alert('Salary should be a number');
      return;
    }

    if (!isValidDate(birthDate)) {
      alert('Birth Date is not in a valid format (YYYY-MM-DD)');
      return;
    }

    // Upload the image file to Firebase Storage
    try {
        const storageRef = ref(storage, 'employee_picture/' + employeeID + '_' + imageFile.name);
        await uploadString(storageRef, imageFile);
        const downloadUrl = await getDownloadURL(storageRef);
        setImageUrl(downloadUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image: ' + error.message);
        return;
      }

    // Add the employee data to Firestore
    try {
      const employeesCollection = collection(db, 'employees');

      const dataToAdd = {
        employeeID: parseInt(employeeID, 10), // Convert to integer
        lastName,
        firstName,
        birthDate,
        salary: parseFloat(salary), // Convert to float
        imageUrl,
      };

      await addDoc(employeesCollection, dataToAdd);

      // Clear the form after successfully adding the data
      setEmployeeID('');
      setLastName('');
      setFirstName('');
      setBirthDate('');
      setSalary('');
      setImageFile(null);
      setImageUrl('');

      console.log('Employee data added to Firestore!');
    } catch (error) {
      console.error('Error adding employee data:', error);
    }
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  return (
    <div>
      <h1>Add Employee</h1>
      <form onSubmit={handleSubmit}>
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
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <br />
        <label>
          Birth Date:
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            pattern="\d{4}-\d{2}-\d{2}"
            title="Please enter a valid date (YYYY-MM-DD)"
          />
        </label>
        <br />
        <label>
          Salary:
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            pattern="\d*"
            title="Please enter only numbers"
          />
        </label>
        <br />
        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <br />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddRecordTest;
