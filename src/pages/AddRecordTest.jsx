import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import db from '../firebase'; // Import your Firestore instance

const AddRecordTest = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [salary, setSalary] = useState('');
  const [image, setImage] = useState('');

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


    // Add the employee data to Firestore
    try {
        const employeesCollection = collection(db, 'employees');
  
        const dataToAdd = {
          employeeID: parseInt(employeeID, 10), // Convert to integer
          lastName,
          firstName,
          birthDate,
          salary: parseFloat(salary), // Convert to float
          image,
        };

      await addDoc(employeesCollection, dataToAdd);

      // Clear the form after successfully adding the data
      setEmployeeID('');
      setLastName('');
      setFirstName('');
      setBirthDate('');
      setSalary('');
      setImage('');

      console.log('Employee data added to Firestore!');
    } catch (error) {
      console.error('Error adding employee data:', error);
    }
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
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
          Image URL:
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        </label>
        <br />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddRecordTest;
