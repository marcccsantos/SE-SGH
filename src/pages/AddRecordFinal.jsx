import React, { useState, useEffect } from 'react';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Import your Firestore and Storage instances

const AddRecordFinal = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');
  const [street, setStreet] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [dateHired, setDateHired] = useState('');
  const [status, setStatus] = useState('');
  const [salaryPerMonth, setSalaryPerMonth] = useState('');
  const [prc, setPrc] = useState('');
  const [prcExpiry, setPrcExpiry] = useState('');
  const [tin, setTin] = useState('');
  const [sss, setSss] = useState('');
  const [sssDeduction, setSssDeduction] = useState('');
  const [philhealth, setPhilhealth] = useState('');
  const [philhealthDeduction, setPhilhealthDeduction] = useState('');
  const [pagibig, setPagibig] = useState('');
  const [pagibigDeduction, setPagibigDeduction] = useState('');
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

  useEffect(() => {
    // Calculate age when date of birth changes
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setAge(age.toString()); // Update age state
    }
  }, [dateOfBirth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate age based on date of birth

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
          firstName,
          middleName,

          province,
          city,
          barangay,
          street,
          lotNumber,

          email,
          contactNumber,
          dateOfBirth,
          age: parseInt(age, 10),
          gender,
          department,
          position,
          dateHired,
          status,
          salaryPerMonth: parseFloat(salaryPerMonth),
          prc,
          prcExpiry,
          tin,
          sss,
          sssDeduction: parseFloat(sssDeduction),
          philhealth,
          philhealthDeduction: parseFloat(philhealthDeduction),
          pagibig,
          pagibigDeduction: parseFloat(pagibigDeduction),
          imageUrl,
        });

      console.log('Record added successfully');
    } catch (error) {
      console.error('Error adding record:', error);
    }

    // Reset form fields
    setEmployeeID('');
    setLastName('');
    setFirstName('');
    setMiddleName('');

    setProvince('');
    setCity('');
    setBarangay('');
    setStreet('');
    setLotNumber('');

    setEmail('');
    setContactNumber('');
    setDateOfBirth('');
    setAge('');
    setGender('');
    setDepartment('');
    setPosition('');
    setDateHired('');
    setStatus('');
    setSalaryPerMonth('');
    setPrc('');
    setPrcExpiry('');
    setTin('');
    setSss('');
    setSssDeduction('');
    setPhilhealth('');
    setPhilhealthDeduction('');
    setPagibig('');
    setPagibigDeduction('');
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
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Middle Name:</label>
        <input
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />
      </div>
      <div>
        <label>Province:</label>
        <input
          type="text"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div>
        <label>Barangay:</label>
        <input
          type="text"
          value={barangay}
          onChange={(e) => setBarangay(e.target.value)}
        />
      </div>
      <div>
        <label>Street:</label>
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </div>
      <div>
        <label>Lot Number:</label>
        <input
          type="text"
          value={lotNumber}
          onChange={(e) => setLotNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Contact Number:</label>
        <input
          type="text"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          disabled // Disable age field
        />
      </div>
      <div>
        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} >
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
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      <div>
        <label>Position:</label>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </div>
      <div>
        <label>Date Hired:</label>
        <input
          type="date"
          value={dateHired}
          onChange={(e) => setDateHired(e.target.value)}
        />
      </div>
      <div>
      <label>Employment Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Regular">Regular</option>
          <option value="Contractual">Contractual</option>
        </select>
      </div>
      <div>
        <label>Salary Per Month:</label>
        <input
          type="number"
          value={salaryPerMonth}
          onChange={(e) => setSalaryPerMonth(e.target.value)}
        />
      </div>
      <div>
        <label>PRC:</label>
        <input
          type="text"
          value={prc}
          onChange={(e) => setPrc(e.target.value)}
        />
      </div>
      <div>
        <label>PRC Expiry:</label>
        <input
          type="date"
          value={prcExpiry}
          onChange={(e) => setPrcExpiry(e.target.value)}
        />
      </div>
      <div>
        <label>TIN:</label>
        <input
          type="text"
          value={tin}
          onChange={(e) => setTin(e.target.value)}
        />
      </div>
      <div>
        <label>SSS:</label>
        <input
          type="text"
          value={sss}
          onChange={(e) => setSss(e.target.value)}
        />
      </div>
      <div>
        <label>SSS Deduction:</label>
        <input
          type="number"
          value={sssDeduction}
          onChange={(e) => setSssDeduction(e.target.value)}
        />
      </div>
      <div>
        <label>Philhealth:</label>
        <input
          type="text"
          value={philhealth}
          onChange={(e) => setPhilhealth(e.target.value)}
        />
      </div>
      <div>
        <label>Philhealth Deduction:</label>
        <input
          type="number"
          value={philhealthDeduction}
          onChange={(e) => setPhilhealthDeduction(e.target.value)}
        />
      </div>
      <div>
        <label>Pagibig:</label>
        <input
          type="text"
          value={pagibig}
          onChange={(e) => setPagibig(e.target.value)}
        />
      </div>
      <div>
        <label>Pagibig Deduction:</label>
        <input
          type="number"
          value={pagibigDeduction}
          onChange={(e) => setPagibigDeduction(e.target.value)} // dapat 0-100 lang to
        />
      </div>
      <div>
        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange}  />
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
