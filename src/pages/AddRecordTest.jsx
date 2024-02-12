import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';  // Import your Firestore and Storage instances
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './AddRecordTest.css'; 
import Header from '../components/header';
import Footer from '../components/footer';

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
  const [sssDeduction, setSssDeduction] = useState('');
  const [philHealthDeduction, setPhilHealthDeduction] = useState('');
  const [pagIbigDeduction, setPagIbigDeduction] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation can be added here if needed
    if (!employeeID || !lastName || !firstName || !middleName) {
      alert('All fields are required.');
      return;
    }
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
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
    <Header/>
      <div className="addTab">
        <div className="add-rec">
          <img src="add-image.png" alt="Avatar" className="add-image"/>
            <div className="">
              <input className="choose-img"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          <p className="support">Supported File Types: .jpg, .png</p>
        </div>
        <div className="add-inputs">
          <form onSubmit={handleSubmit}>
            <div className="container">
              <label htmlFor="empID">Employee ID:</label>
                <input
                  type="text"
                  id="empID"
                  value={employeeID}
                  onChange={(e) => setEmployeeID(e.target.value)}
                   
                  autoComplete="given-id"
                />
              <label htmlFor="lname">Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  id="lname"
                  name="lname"
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder=" " 
                   
                  autoComplete="family-name"
                />
              <label htmlFor="fname">First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  id="fname"
                  name="fname"
                  onChange={(e) => setFirstName(e.target.value)}
                   
                  autoComplete="given-name"
                />
              <label htmlFor="mname">Middle Name:</label>
                <input
                  type="text"
                  value={middleName}
                  id="mname"
                  name="mname"
                  onChange={(e) => setMiddleName(e.target.value)}
                   
                  autoComplete="additional-name"
                />
              <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  value={address}
                  id="address"
                  name="address"
                  onChange={(e) => setAddress(e.target.value)}
                    
                  autoComplete="address" 
                />
              <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  value={email}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email" 
                />
              <label htmlFor="contact">Contact:</label>
                <input
                  type="text"
                  name="contact" 
                  id="contact"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              <label htmlFor="birthday">Birthday:</label>
                <input
                  type="date"
                  name="birthday" 
                  id="birthday" 
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                   
                  autoComplete="bday"
                />
              <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  name="age" 
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                   
                  autoComplete="age" 
                />
              <label htmlFor="sex">Sex:</label>
                <input className="sex" 
                  type="text"
                  name="sex"
                  id="sex" 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
              <label htmlFor="rate">Rate/Month: </label>
                <input
                  type="number"
                  value={salaryPerMonth}
                  name="rate" 
                  id="rate"
                  onChange={(e) => setSalaryPerMonth(e.target.value)}
                   
                  placeholder="₱"
                />
              <label htmlFor="status">Status:</label>
                <input className="status"
                  type="text"
                  name="status"
                  id="status" 
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                />
              <label htmlFor="department">Department: </label>
                <input
                  type="text"
                  name="department" 
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                   
                />
                <label htmlFor="position">Position: </label>
                <input
                  type="text"
                  name="position"
                  id="position" 
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                   
                />
                <label htmlFor="hire">Date Hired: </label>
                <input
                  type="date"
                  name="hire" 
                  id="hire"
                  value={dateHired}
                  onChange={(e) => setDateHired(e.target.value)}
                   
                />
              <label htmlFor="tin">T.I.N. #:</label>
                <input
                  type="text"
                  name="tin" 
                  id="tin"
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                   
                />
              <label htmlFor="sss">S.S.S. #:</label>
                <input
                  type="text"
                  name="sss" 
                  id="sss"
                  value={sss}
                  onChange={(e) => setSss(e.target.value)}
                   
                />
              <label htmlFor="prc">P.R.C. #:</label>
                <input
                  type="text"
                  name="prc" 
                  id="prc"
                  value={prc}
                  onChange={(e) => setPrc(e.target.value)}
                   
                />
              <label htmlFor="expiry">PRC Expiry: </label>
                <input
                  type="date"
                  name="expiry" 
                  id="expiry"
                  value={prcExpiry}
                  onChange={(e) => setPrcExpiry(e.target.value)}
                   
                />
              <label htmlFor="pag-ibig">Pag-IBIG #:</label>
                <input
                  type="text"
                  name="pag-ibig"
                  id="pag-ibig"
                  value={pagibig}
                  onChange={(e) => setPagibig(e.target.value)}
                   
                />
              <label htmlFor="phil">PhilHealth #:</label>
                <input
                  type="text"
                  name="phil"
                  id="phil"
                  value={philhealth}
                  onChange={(e) => setPhilhealth(e.target.value)}
                   
                />
                <input 
                  type="number" 
                  value={sssDeduction} 
                  onChange={(e) => setSssDeduction(e.target.value)} 
                  placeholder="SSS Deduction Percentage" 
                  min="0" max="100" />
                <input 
                  type="number" 
                  value={philHealthDeduction} 
                  onChange={(e) => setPhilHealthDeduction(e.target.value)} 
                  placeholder="PhilHealth Deduction Percentage" 
                  min="0" max="100" />
                <input 
                  type="number" 
                  value={pagIbigDeduction} 
                  onChange={(e) => setPagIbigDeduction(e.target.value)} 
                  placeholder="PagIBIG Deduction Percentage" 
                  min="0" max="100" />
                <input type="file" onChange={handleImageChange} />
                  {imagePreview && <img src={imagePreview} alt="Preview" />}
              <button className="save" type="submit">Save</button>
              <button className="cancel" type="save">Cancel</button>  
            </div>
          </form>
        </div>
      </div>
    <Footer/>
  </div>
  );
};

export default AddRecordTest;
