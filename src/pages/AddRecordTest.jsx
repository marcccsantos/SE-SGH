import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';  // Import your Firestore and Storage instances
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddRecordTest = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [birthday, setBirthday] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [salaryPerMonth, setSalaryPerMonth] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [dateHired, setDateHired] = useState('');
  const [tin, setTin] = useState('');
  const [sss, setSss] = useState('');
  const [prc, setPrc] = useState('');
  const [prcExpiry, setPrcExpiry] = useState('');
  const [pagibig, setPagibig] = useState('');
  const [philhealth, setPhilhealth] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation can be added here if needed

    try {
      // Add the employee data to Firestore
      const employeesCollection = collection(db, 'employees');

      const dataToAdd = {
        employeeID: parseInt(employeeID, 10),
        lastName,
        firstName,
        middleName,
        address,
        email,
        contactNumber,
        birthday,
        age: parseInt(age, 10),
        gender,
        salaryPerMonth: parseFloat(salaryPerMonth),
        employmentStatus,
        department,
        position,
        dateHired,
        tin,
        sss,
        prc,
        prcExpiry,
        pagibig,
        philhealth,
      };

      await addDoc(employeesCollection, dataToAdd);

      // Clear the form after successfully adding the data
      setEmployeeID('');
      setLastName('');
      setFirstName('');
      setMiddleName('');
      setAddress('');
      setEmail('');
      setContactNumber('');
      setBirthday('');
      setAge('');
      setGender('');
      setSalaryPerMonth('');
      setEmploymentStatus('');
      setDepartment('');
      setPosition('');
      setDateHired('');
      setTin('');
      setSss('');
      setPrc('');
      setPrcExpiry('');
      setPagibig('');
      setPhilhealth('');

      console.log('Employee data added to Firestore!');
    } catch (error) {
      console.error('Error adding employee data:', error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `employee_picture/${employeeID}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      console.log('Image uploaded successfully:', downloadUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  //Restrictions yet to be added
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
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <br />
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Middle Name:
          <input
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email Address:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Contact Number:
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </label>
        <br />
        <label>
          Birthday:
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </label>
        <br />
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
        <br />
        <label>
          Gender:
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </label>
        <br />
        <label>
          Salary per Month:
          <input
            type="number"
            value={salaryPerMonth}
            onChange={(e) => setSalaryPerMonth(e.target.value)}
          />
        </label>
        <br />
        <label>
          Employment Status:
          <input
            type="text"
            value={employmentStatus}
            onChange={(e) => setEmploymentStatus(e.target.value)}
          />
        </label>
        <br />
        <label>
          Department:
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </label>
        <br />
        <label>
          Position:
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </label>
        <br />
        <label>
          Date Hired:
          <input
            type="date"
            value={dateHired}
            onChange={(e) => setDateHired(e.target.value)}
          />
        </label>
        <br />
        <label>
          T.I.N. #:
          <input
            type="text"
            value={tin}
            onChange={(e) => setTin(e.target.value)}
          />
        </label>
        <br />
        <label>
          S.S.S. #:
          <input
            type="text"
            value={sss}
            onChange={(e) => setSss(e.target.value)}
          />
        </label>
        <br />
        <label>
          P.R.C. #:
          <input
            type="text"
            value={prc}
            onChange={(e) => setPrc(e.target.value)}
          />
        </label>
        <br />
        <label>
          P.R.C. Expiry:
          <input
            type="date"
            value={prcExpiry}
            onChange={(e) => setPrcExpiry(e.target.value)}
          />
        </label>
        <br />
        <label>
          Pag-IBIG #:
          <input
            type="text"
            value={pagibig}
            onChange={(e) => setPagibig(e.target.value)}
          />
        </label>
        <br />
        <label>
          PhilHealth #:
          <input
            type="text"
            value={philhealth}
            onChange={(e) => setPhilhealth(e.target.value)}
          />
        </label>
        <br />
        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
        <br />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddRecordTest;
