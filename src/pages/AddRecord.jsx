import React, { useState, useEffect } from 'react';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Import your Firestore and Storage instances
import './AddRecord.css'; 
import Header from '../components/header';
import Footer from '../components/footer';

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
    <>
      <Header />

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="upload-img">
            <div className="preview">
            {previewImage ? (
                <img className="preview-img" src={previewImage} alt="Preview" style={{ maxWidth: '200px' }} />
            ):(
                <div className="preview-img">
                <img src="add-image.png" alt="Avatar"/>
                </div>
            )}
            </div>
            <div className="upload">
            <input type="file" accept="image/*" onChange={handleImageChange}  />
            </div>
          </div>

            <div className="form-information">
              <div className="info">
                <div className="personal-information">
                  <h1>Personal Information</h1>
                </div>

                <div className="text-fields">
                  <div className='empid'>
                    <label className="field" >
                      <input
                          type="text"
                          name="empid"
                          id="empid"
                          value={employeeID}
                          onChange={(e) => setEmployeeID(e.target.value.trim())}
                          className="input"
                          required
                      />
                      <span className="placeholder">Employee ID</span>
                    </label>
                  </div>
                  <div className="fname">
                    <label className="field">
                      <input
                          type="text"
                          name="fname"
                          id="fname"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">First Name</span>
                    </label>
                  </div>
                  <div>
                    <label className="field">
                      <input
                          type="text"
                          name="lname"
                          id="lname"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">Last Name</span>
                    </label>
                  </div>
                  <div>
                    <label className="field">
                      <input
                          type="text"
                          name="mname"
                          id="mname"
                          value={middleName}
                          onChange={(e) => setMiddleName(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">Middle Name</span>
                    </label>
                  </div>
                  <div>
                    <label className="field">
                      <input
                          type="text"
                          name="contact"
                          id="contact"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">Contact No</span>
                    </label>
                  </div>
                  <div className="email">
                    <label className="field">
                      <input 
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">Email</span>
                    </label>
                  </div>
                  <div className="date">
                    <label className="field">
                      <input
                          type="date"
                          name="date"
                          id="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">Date of Birth</span>
                    </label>
                  </div>
                  <div className="age">
                    <label className="field">
                      <input
                          type="text"
                          name="age"
                          id="age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          disabled // Disable age field
                          className="input"
                      />
                      <span className={`placeholder ${age ? 'filled' : ''}`}>Age</span>
                    </label>
                  </div>
                  <div className="gender">
                    <label className="field">
                        <select 
                          name="gender" 
                          id="gender" 
                          value={gender} 
                          onChange={(e) => setGender(e.target.value)} 
                          className="input" 
                          required
                        >
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <span className="placeholder">Gender</span>
                    </label>
                  </div>
                </div>  
              </div>

              <div className="address-info">
                <div className="address-information">
                  <h1>Address Information</h1>
                </div>

                <div className="text-fields">
                  <div className="address">
                    <label className="field">
                      <input
                          type="text"
                          name="street"
                          id="street"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">Street Address</span>
                    </label>
                  </div>
                  <div className="city">
                    <label className="field">
                      <input
                          type="text"
                          name="city"
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">City</span>
                    </label>
                  </div>
                  <div className="province">
                    <label className="field">
                      <input
                          type="text"
                          name="province"
                          id="province"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">Province</span>
                    </label>
                  </div>
                  <div className="barangay">
                    <label className="field">
                      <input
                          type="text"
                          name="barangay"
                          id="barangay"
                          value={barangay}
                          onChange={(e) => setBarangay(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">Barangay</span>
                    </label>
                  </div>
                  <div className="lot">
                    <label className="field">
                      <input
                          type="text"
                          name="lot"
                          id="lot"
                          value={lotNumber}
                          onChange={(e) => setLotNumber(e.target.value)}
                          className="input"
                          required
                      />
                      <span className="placeholder">Lot Number</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="employee-info">
                <div className="employment-information">
                  <h1>Employment Information</h1>
                </div>

                <div className="text-fields">
                  <div className="department">
                    <label className="field">
                      <input
                        type="text"
                        name="department"
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="input"
                        required
                      />
                      <span className="placeholder">Department</span>
                    </label>
                  </div>
                  <div className="position">
                    <label className="field">
                      <input
                        type="text"
                        name="position"
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="input"
                        required
                      />
                      <span className="placeholder">Position</span>
                    </label>
                  </div>
                  <div className="hired">
                    <label className="field">
                      <input
                        type="date"
                        name="hired"
                        id="hired"
                        value={dateHired}
                        onChange={(e) => setDateHired(e.target.value)}
                        className="input"
                        required
                      />
                      <span className="placeholder">Date Hired</span>
                    </label>
                  </div>
                  <div className="salary">
                    <label className="field">
                      <input
                        type="number"
                        name="salary"
                        id="salary"
                        value={salaryPerMonth}
                        onChange={(e) => setSalaryPerMonth(e.target.value)}
                        className="input"
                        required
                      />
                      <span className="placeholder">Salary</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="id-info">
                <div className="id-information">
                  <h1>Goverment IDs and Benefits</h1>
                </div>

                <div className="text-fields">
                <div>
                  <label className="field">
                    <input
                      type="text"
                      name="tin"
                      id="tin"
                      value={tin}
                      onChange={(e) => setTin(e.target.value)}
                      className="input"
                      required
                    />
                    <span className="placeholder">TIN</span>
                  </label>
                </div>
                <div className="prc">
                  <label className="field">
                    <input
                      type="text"
                      name="prc"
                      id="prc"
                      value={prc}
                      onChange={(e) => setPrc(e.target.value)}
                      className="input"
                      required
                    />
                    <span className="placeholder">PRC</span>
                  </label>
                </div>
                <div className="prc-expiry">
                  <label className="field">
                    <input
                      type="date"
                      name="prcExpiry"
                      id="prcExpiry"
                      value={prcExpiry}
                      onChange={(e) => setPrcExpiry(e.target.value)}
                      className="input"
                      required
                    />
                    <span className="placeholder">PRC Expiry</span>
                  </label>
                </div>
                <div className="sss">
                  <label className="field">
                    <input
                      type="text"
                      name="sss"
                      id="sss"
                      value={sss}
                      onChange={(e) => setSss(e.target.value)}
                      className="input"
                      required
                    />
                    <span className="placeholder">SSS</span>
                  </label>
                </div>
                <div className="sss-deduction">
                  <label className="field">
                    <input
                      type="number"
                      name="sssDeduction"
                      id="sssDeduction"
                      value={sssDeduction}
                      onChange={(e) => setSssDeduction(e.target.value)}
                      className="input"
                      required
                    />
                    <span className="placeholder">SSS Deduction</span>
                  </label>
                </div>
                <div className="philhealth">
                  <label className="field">
                    <input
                      type="text"
                      name="philhealth"
                      id="philhealth"
                      value={philhealth}
                      onChange={(e) => setPhilhealth(e.target.value)}
                      className="input"
                      required
                    />
                    <span className="placeholder">Philhealth</span>
                  </label>
                </div>
                <div className="philhealth-deduction">
                  <label className="field">
                    <input
                      type="number"
                      name="philhealthDeduction"
                      id="philhealthDeduction"
                      value={philhealthDeduction}
                      onChange={(e) => setPhilhealthDeduction(e.target.value)}
                      className="input"
                      required
                    />
                    <span className="placeholder">Philhealth Deduction</span>
                  </label>
                </div>
                <div className="pagibig">
                  <label className="field">
                    <input
                      type="text"
                      name="pagibig"
                      id="pagibig"
                      value={pagibig}
                      onChange={(e) => setPagibig(e.target.value)}
                      className="input"
                      required
                    />
                    <span className="placeholder">Pagibig</span>
                  </label>
                </div>
                <div className="pagibig-deduction">
                  <label className="field">
                    <input
                      type="number"
                      name="pagibigDeduction"
                      id="pagibigDeduction"
                      value={pagibigDeduction}
                      onChange={(e) => setPagibigDeduction(e.target.value)} // dapat 0-100 lang to
                      className="input"
                      required
                    />
                    <span className="placeholder">Pagibig Deduction</span>
                  </label>
                </div>
              </div>
              <div className="save-rec">
                <div>
                  <button type="submit" className="save-btn-rec">Submit</button>
                </div>
                <div>
                  <button className="cancel-add">Cancel</button>
                </div>
              </div>
            </div>
          </div>

          
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddRecordFinal;
