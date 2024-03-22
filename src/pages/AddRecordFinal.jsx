import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebase"; // Import your Firestore and Storage instances
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Header from "../components/header";
import Footer from "../components/footer";
import { IoIosInformationCircle } from "react-icons/io";
import Loading from "../components/loading";

const AddRecordFinal = () => {
  const [employeeID, setEmployeeID] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [street, setStreet] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [dateHired, setDateHired] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [shift, setShift] = useState("");
  const [salaryPerMonth, setSalaryPerMonth] = useState("");
  const [prc, setPrc] = useState("");
  const [prcExpiry, setPrcExpiry] = useState("");
  const [tin, setTin] = useState("");
  const [sss, setSss] = useState("");
  const [sssDeduction, setSssDeduction] = useState("");
  const [philhealth, setPhilhealth] = useState("");
  const [philhealthDeduction, setPhilhealthDeduction] = useState("");
  const [pagibig, setPagibig] = useState("");
  const [pagibigDeduction, setPagibigDeduction] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupCred, setShowPopupCred] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      setAge(age.toString()); // Update age state
    }
  }, [dateOfBirth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Calculate age based on date of birth

    // Check if employeeID already exists
    const employeeQuery = query(
      collection(db, "employees_active"),
      where("employeeID", "==", employeeID.trim())
    );
    const employeeQuerySnapshot = await getDocs(employeeQuery);
    if (!employeeQuerySnapshot.empty) {
      console.error("Employee ID already exists");
      return;
    }

    try {
      // Set filename to employeeID
      const filename = `${employeeID.trim()}`;
      const imageRef = ref(storage, `employees_pictures/${filename}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Add record to Firestore database
      const docRef = await addDoc(collection(db, "employees_active"), {
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
        role,
        shift,
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

      setLoading(false);

      // Retrieve the email from the added document
      const docSnapshot = await getDoc(docRef);
      const emailUser = docSnapshot.data().email;

      // Create a user with email and a concatenated password
      const auth = getAuth();
      const password = `${employeeID.trim()}${lastName}`; // Concatenate employeeID and lastName
      console.log(password);
      setUserName(emailUser);
      setPassword(password);
      await createUserWithEmailAndPassword(auth, emailUser, password);

      setShowPopup(true);
      console.log("Record added successfully");
    } catch (error) {
      setLoading(false);
      console.error("Error adding record:", error);
    }

    // Reset form fields
    setEmployeeID("");
    setLastName("");
    setFirstName("");
    setMiddleName("");

    setProvince("");
    setCity("");
    setBarangay("");
    setStreet("");
    setLotNumber("");

    setEmail("");
    setContactNumber("");
    setDateOfBirth("");
    setAge("");
    setGender("");
    setDepartment("");
    setPosition("");
    setDateHired("");
    setStatus("");
    setSalaryPerMonth("");
    setRole("");
    setShift("");
    setPrc("");
    setPrcExpiry("");
    setTin("");
    setSss("");
    setSssDeduction("");
    setPhilhealth("");
    setPhilhealthDeduction("");
    setPagibig("");
    setPagibigDeduction("");
    setImage(null);
    setPreviewImage(null);
  };

  const goBack = () => {
    window.history.back();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowPopupCred(true);
  };

  const handleClosePopupCred = () => {
    setShowPopupCred(false);
  };

  return (
    <>
      <Header />
      <form
        onSubmit={handleSubmit}
        className=" mx-5 md:mx-16 mt-8 mb-8 flex flex-col p-3 bg-[#e8e8e8] sm:min-h-lvh"
      >
        <div className="flex items-center flex-col">
          <div className="font-inter">
            <div>
              <div className=" flex justify-center items-center w-full h-[240px] mb-2 bg-white">
                {previewImage ? (
                  <div className="flex items-center justify-center w-full">
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ maxWidth: "150px" }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <p>No image selected</p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid w-full max-w-xs items-center gap-1.5">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex h-10 w-full  border border-input bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-5 font-inter">
          {/* Personal Information */}
          <div className="mt-5 flex flex-1 justify-start items-start flex-col bg-white">
            <h1 className="w-full flex justify-start p-2 bg-[#176906] text-white">
              Personal Information
            </h1>
            <div className="grid grid-cols-2 w-full my-5 px-3 md:gap-y-0.5 gap-y-1">
              <label
                htmlFor="empid"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Employee ID
              </label>
              <input
                type="text"
                name="empid"
                id="empid"
                value={employeeID}
                onChange={(e) => setEmployeeID(e.target.value.trim())}
                autoComplete="off"
                required
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="fname"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                First Name
              </label>
              <input
                type="text"
                name="fname"
                id="fname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="off"
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="lname"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lname"
                id="lname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="off"
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="mname"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Middle Name
              </label>
              <input
                type="text"
                name="mname"
                id="mname"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                required
                autoComplete="off"
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="contact"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Contact No.
              </label>
              <input
                type="text"
                name="contact"
                id="contact"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                autoComplete="off"
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="email"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="date"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                autoComplete="off"
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="age"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Age
              </label>
              <input
                type="text"
                name="age"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled // Disable age field
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="gender"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
                required
              >
                <option value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Address Information */}
          <div className="mt-5 flex flex-1 justify-start items-start flex-col bg-white">
            <h1 className=" w-full flex justify-start p-2 bg-[#176906] text-white">
              Address Information
            </h1>
            <div className="grid grid-cols-2 w-full my-5 px-3 md:gap-y-0.5 gap-y-1">
              <label
                htmlFor="street"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Street
              </label>
              <input
                type="text"
                name="street"
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="city"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="province"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Province
              </label>
              <input
                type="text"
                name="province"
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="barangay"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Barangay
              </label>
              <input
                type="text"
                name="barangay"
                id="barangay"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="lot"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Lot Number
              </label>
              <input
                type="text"
                name="lot"
                id="lot"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-5 font-inter">
          {/* Government ID and Benefits */}
          <div className="mt-5 flex flex-1 justify-start items-start flex-col bg-white">
            <h1 className=" w-full flex justify-start p-2 bg-[#176906] text-white">
              Government IDs and Benefits
            </h1>
            <div className="grid grid-cols-2 w-full my-5 px-3 md:gap-y-0.5 gap-y-1">
              <label
                htmlFor="tin"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                TIN
              </label>
              <input
                type="text"
                name="tin"
                id="tin"
                value={tin}
                onChange={(e) => setTin(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="prc"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                PRC
              </label>
              <input
                type="text"
                name="prc"
                id="prc"
                value={prc}
                onChange={(e) => setPrc(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="prcExpiry"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                PRC Expiry
              </label>
              <input
                type="date"
                name="prcExpiry"
                id="prcExpiry"
                value={prcExpiry}
                onChange={(e) => setPrcExpiry(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="sss"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                SSS
              </label>
              <input
                type="text"
                name="sss"
                id="sss"
                value={sss}
                onChange={(e) => setSss(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="sssDeduction"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                SSS Deduction
              </label>
              <input
                type="number"
                name="sssDeduction"
                id="sssDeduction"
                value={sssDeduction}
                onChange={(e) => setSssDeduction(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="philhealth"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Philhealth
              </label>
              <input
                type="text"
                name="philhealth"
                id="philhealth"
                value={philhealth}
                onChange={(e) => setPhilhealth(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="philhealthDeduction"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px] whitespace-nowrap"
              >
                <div className="overflow-hidden">Philhealth Deduction</div>
              </label>
              <input
                type="number"
                name="philhealthDeduction"
                id="philhealthDeduction"
                value={philhealthDeduction}
                onChange={(e) => setPhilhealthDeduction(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="pagibig"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Pagibig
              </label>
              <input
                type="text"
                name="pagibig"
                id="pagibig"
                value={pagibig}
                onChange={(e) => setPagibig(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="pagibigDeduction"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px] whitespace-nowrap"
              >
                <div className="overflow-hidden">Pagibig Deduction</div>
              </label>
              <input
                type="number"
                name="pagibigDeduction"
                id="pagibigDeduction"
                value={pagibigDeduction}
                onChange={(e) => setPagibigDeduction(e.target.value)} // dapat 0-100 lang to
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
            </div>
          </div>

          {/* Employment Information */}
          <div className="mt-5 flex flex-1 justify-start items-start flex-col bg-white">
            <h1 className=" w-full flex justify-start p-2 bg-[#176906] text-white">
              Employment Information
            </h1>
            <div className="grid grid-cols-2 w-full my-5 px-3 md:gap-y-0.5 gap-y-1">
              <label
                htmlFor="department"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Department
              </label>
              <input
                type="text"
                name="department"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="position"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Position
              </label>
              <input
                type="text"
                name="position"
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="hired"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Date Hired
              </label>
              <input
                type="date"
                name="hired"
                id="hired"
                value={dateHired}
                onChange={(e) => setDateHired(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="salary"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Salary
              </label>
              <input
                type="number"
                name="salary"
                id="salary"
                value={salaryPerMonth}
                onChange={(e) => setSalaryPerMonth(e.target.value)}
                required
                autoComplete="off"
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="role"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                System Role
              </label>
              <select
                name="role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
                required
              >
                <option value=""></option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <label
                htmlFor="shift"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Shift Schedule
              </label>
              <select
                name="shift"
                id="shift"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
                required
              >
                <option value=""></option>
                <option value="7-5">7:00AM - 5:00PM</option>
                <option value="5-7">5:00PM - 7:00AM</option>
                <option value="8-5">8:00AM - 5:00PM</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-end mt-5 p-3 font-inter font-medium">
          <div className="mr-2 px-3 py-1 flex items-center bg-[#176906] hover:bg-[#155e06]">
            <button type="submit" className="text-white hover:underline">
              Submit
            </button>
          </div>
          <div className="mr-2 px-3 py-1 flex items-center bg-white">
            <button className="hover:underline" onClick={goBack}>
              Cancel
            </button>
          </div>
        </div>
      </form>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center w-full h-lvh font-inter bg-[#00000080]">
          <div className="absolute flex flex-col items-center justify-center bg-white p-8 font-medium">
            <div className="flex flex-row justify-center items-center ">
              <IoIosInformationCircle className="w-10 h-10 text-blue-600" />
              <p className="ml-2">Record added successfully</p>
            </div>
            <div className="mt-5 flex justify-end w-full">
              <button
                className="border border-black px-7 hover:underline"
                onClick={handleClosePopup}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopupCred && (
        <div className="fixed inset-0 flex items-center justify-center w-full h-lvh font-inter bg-[#00000080]">
          <div className="absolute flex flex-col items-center justify-center bg-white p-8 font-medium">
            <div className="flex flex-row">
              <div className="flex flex-row justify-start items-start mt-3">
                <IoIosInformationCircle className="w-10 h-10 text-blue-600" />
              </div>
              <div className="flex flex-col justify-start items-start w-full mt-3 ml-3">
                <p className="mb-1">User Credentials:</p>
                <p>Username: {userName}</p>
                <p>Password: {password}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end w-full">
              <button
                className="border border-black px-7 hover:underline"
                onClick={handleClosePopupCred}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center w-full h-lvh bg-white border border-red-500">
          <div className="absolute flex flex-col items-center justify-center bg-white p-8 ">
            <div className="loader-container">
              <div className="loader"></div>
              <div className="loader-text">Loading...</div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AddRecordFinal;
