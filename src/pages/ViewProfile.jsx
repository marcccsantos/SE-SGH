import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase"; // Import your Firestore and Storage instances
import "./AddRecord.css";
import Header from "../components/header";
import Footer from "../components/footer";
import NotFound from "./not-found";

const ViewProfile = () => {
  const { employeeID } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [newImage, setNewImage] = useState(null); // New state to hold newly uploaded image
  const [age, setAge] = useState("");
  const [extras, setExtras] = useState("");
  const [deductions, setDeductions] = useState("");
  const [extrasReason, setExtrasReason] = useState(""); // Add state for extrasReason
  const [deductionsReason, setDeductionsReason] = useState(""); // Add state for deductionsReason
  const [selectedDate, setSelectedDate] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeQuery = query(
          collection(db, "employees_active"),
          where("employeeID", "==", employeeID)
        );
        const querySnapshot = await getDocs(employeeQuery);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setEmployeeData(docData);
          // Fetch logs data here
          const logsQuery = query(
            collection(db, "extras_and_deductions"),
            where("employeeID", "==", employeeID)
          );
          const logsSnapshot = await getDocs(logsQuery);
          const logsData = logsSnapshot.docs.map((doc) => doc.data());
          setLogs(logsData);
        } else {
          console.error("No employee found with the provided ID");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
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
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
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
      if (
        editedData.dateOfBirth &&
        editedData.dateOfBirth !== employeeData.dateOfBirth
      ) {
        const today = new Date();
        const birthDate = new Date(editedData.dateOfBirth);
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
          calculatedAge--;
        }
        updatedAge = calculatedAge;
      }

      // Convert age to number
      updatedAge = parseInt(updatedAge, 10);

      // Update Firestore document with new data including the updated age
      const employeeRef = doc(db, "employees_active", documentId);
      await updateDoc(employeeRef, {
        ...editedData,
        age: updatedAge,
        imageUrl,
      });
      setIsEditing(false);
      console.log("Employee data updated successfully");
    } catch (error) {
      console.error("Error updating employee data:", error);
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
    return;
  }

  // Function to handle submission of extras and deductions
  const submitExtrasAndDeductions = async () => {
    try {
      if (!selectedDate || (extras === "" && deductions === "")) {
        console.error(
          "Date and at least one of Extras or Deductions are required."
        );
        return;
      }

      // Create a new document in the "extras_and_deductions" collection
      await addDoc(collection(db, "extras_and_deductions"), {
        date: selectedDate,
        employeeID,
        extras: parseFloat(extras), // Convert to number
        deductions: parseFloat(deductions), // Convert to number
        extrasReason, // Include extras reason
        deductionsReason, // Include deductions reason
      });
      // Clear input fields after submission
      setSelectedDate("");
      setExtras("");
      setDeductions("");
      setExtrasReason("");
      setDeductionsReason("");
      console.log("Extras and deductions submitted successfully");
    } catch (error) {
      console.error("Error submitting extras and deductions:", error);
    }
  };

  return (
    <>
      <Header />
      <form className=" mx-5 md:mx-16 mt-8 mb-8 flex flex-col p-3 bg-[#e8e8e8] sm:min-h-lvh">
        <div className="flex items-center flex-col">
          <div className="font-inter">
            <div>
              <div className=" flex justify-center items-center w-full h-[240px] mb-2 bg-white">
                {isEditing ? (
                  <div className="flex items-center justify-center w-full">
                    <img
                      src={
                        newImage
                          ? URL.createObjectURL(newImage)
                          : employeeData.imageUrl
                      }
                      alt="Employee"
                      style={{ maxWidth: "150px" }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                ) : (
                  <img
                    src={employeeData.imageUrl}
                    alt="Employee"
                    style={{ maxWidth: "150px" }}
                  />
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
                value={employeeData.employeeID}
                readOnly
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
                value={
                  isEditing ? editedData.firstName : employeeData.firstName
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={isEditing ? editedData.lastName : employeeData.lastName}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing ? editedData.middleName : employeeData.middleName
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing
                    ? editedData.contactNumber
                    : employeeData.contactNumber
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={isEditing ? editedData.email : employeeData.email}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing ? editedData.dateOfBirth : employeeData.dateOfBirth
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="age"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                value={age}
                readOnly
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
                value={isEditing ? editedData.gender : employeeData.gender}
                onChange={(e) => handleChange(e)}
                disabled={!isEditing}
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
            <h1 className="w-full flex justify-start p-2 bg-[#176906] text-white">
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
                value={isEditing ? editedData.street : employeeData.street}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={isEditing ? editedData.city : employeeData.city}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={isEditing ? editedData.province : employeeData.province}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={isEditing ? editedData.barangay : employeeData.barangay}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing ? editedData.lotNumber : employeeData.lotNumber
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={isEditing ? editedData.tin : employeeData.tin}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={isEditing ? editedData.prc : employeeData.prc}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing ? editedData.prcExpiry : employeeData.prcExpiry
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={isEditing ? editedData.sss : employeeData.sss}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing
                    ? editedData.sssDeduction
                    : employeeData.sssDeduction
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing ? editedData.philhealth : employeeData.philhealth
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing
                    ? editedData.philhealthDeduction
                    : employeeData.philhealthDeduction
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="pagibig"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px] whitespace-nowrap"
              >
                Pagibig
              </label>
              <input
                type="text"
                name="pagibig"
                id="pagibig"
                value={isEditing ? editedData.pagibig : employeeData.pagibig}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing
                    ? editedData.pagibigDeduction
                    : employeeData.pagibigDeduction
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing ? editedData.department : employeeData.department
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={isEditing ? editedData.position : employeeData.position}
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing ? editedData.dateHired : employeeData.dateHired
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
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
                value={
                  isEditing
                    ? editedData.salaryPerMonth
                    : employeeData.salaryPerMonth
                }
                readOnly={!isEditing}
                onChange={handleChange}
                required
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="role"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                System Role
              </label>
              <input
                type="text"
                name="role"
                id="role"
                value={
                  employeeData.role === "admin"
                    ? "Admin"
                    : employeeData.role === "employee"
                    ? "Employee"
                    : employeeData.role // Default value if none of the conditions match
                }
                readOnly
                required
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="shift"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Shift Schedule
              </label>
              <input
                type="text"
                name="shift"
                id="shift"
                value={
                  employeeData.shift === "7-5"
                    ? "7:00AM to 5:00PM"
                    : employeeData.shift === "5-7"
                    ? "5:00PM to 7:00AM"
                    : employeeData.shift === "8-5"
                    ? "8:00AM to 5:00PM"
                    : employeeData.shift // Default value if none of the conditions match
                }
                readOnly
                required
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
            </div>
          </div>
        </div>
        {isEditing ? (
          <div>
            <button type="button" className="save-btn-rec" onClick={handleSave}>
              Save
            </button>
            <button
              type="button"
              className="save-btn-rec"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <button type="button" className="cancel-add" onClick={handleEdit}>
              Edit
            </button>
          </div>
        )}
      </form>

      {/* <div className="form-container">
        <form>
          <div className="upload-img">
            <div className="preview">
              {isEditing ? (
                <>
                  <img
                    src={
                      newImage
                        ? URL.createObjectURL(newImage)
                        : employeeData.imageUrl
                    }
                    alt="Employee"
                    style={{ maxWidth: "200px" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </>
              ) : (
                <img
                  src={employeeData.imageUrl}
                  alt="Employee"
                  style={{ maxWidth: "200px" }}
                />
              )}
            </div>
          </div>
          <div className="form-information">
            <div className="info">
              <div className="personal-information">
                <h1>Personal Information</h1>
              </div>

              <div className="text-fields">
                <div className="empid">
                  <label className="field">
                    <input
                      type="text"
                      name="empid"
                      id="empid"
                      value={employeeData.employeeID}
                      readOnly
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
                      value={
                        isEditing
                          ? editedData.firstName
                          : employeeData.firstName
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing ? editedData.lastName : employeeData.lastName
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.middleName
                          : employeeData.middleName
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.contactNumber
                          : employeeData.contactNumber
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={isEditing ? editedData.email : employeeData.email}
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.dateOfBirth
                          : employeeData.dateOfBirth
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                    <span className="placeholder">Date of Birth</span>
                  </label>
                </div>
                <div className="age">
                  <label className="field">
                    <input
                      type="number"
                      name="age"
                      id="age"
                      value={age}
                      readOnly
                      className="input"
                    />
                    <span className={`placeholder ${age ? "filled" : ""}`}>
                      Age
                    </span>
                  </label>
                </div>
                <div className="gender">
                  <label className="field">
                    <select
                      name="gender"
                      id="gender"
                      value={
                        isEditing ? editedData.gender : employeeData.gender
                      }
                      onChange={(e) => handleChange(e)}
                      disabled={!isEditing}
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
                      value={
                        isEditing ? editedData.street : employeeData.street
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={isEditing ? editedData.city : employeeData.city}
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing ? editedData.province : employeeData.province
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing ? editedData.barangay : employeeData.barangay
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.lotNumber
                          : employeeData.lotNumber
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.department
                          : employeeData.department
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing ? editedData.position : employeeData.position
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.dateHired
                          : employeeData.dateHired
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.salaryPerMonth
                          : employeeData.salaryPerMonth
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                    <span className="placeholder">Salary</span>
                  </label>
                </div>
                <div className="role">
                  <label className="field">
                    <input
                      type="text"
                      name="role"
                      id="role"
                      value={
                        employeeData.role === "admin"
                          ? "Admin"
                          : employeeData.role === "employee"
                          ? "Employee"
                          : employeeData.role // Default value if none of the conditions match
                      }
                      readOnly
                      className="input"
                      required
                    />
                    <span className="placeholder">System Role</span>
                  </label>
                </div>
                <div className="shift">
                  <label className="field">
                    <input
                      type="text"
                      name="shift"
                      id="shift"
                      value={
                        employeeData.shift === "7-5"
                          ? "7:00AM to 5:00PM"
                          : employeeData.shift === "5-7"
                          ? "5:00PM to 7:00AM"
                          : employeeData.shift === "8-5"
                          ? "8:00AM to 5:00PM"
                          : employeeData.shift // Default value if none of the conditions match
                      }
                      readOnly
                      className="input"
                      required
                    />
                    <span className="placeholder">Shift Schedule</span>
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
                      value={isEditing ? editedData.tin : employeeData.tin}
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={isEditing ? editedData.prc : employeeData.prc}
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.prcExpiry
                          : employeeData.prcExpiry
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={isEditing ? editedData.sss : employeeData.sss}
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.sssDeduction
                          : employeeData.sssDeduction
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.philhealth
                          : employeeData.philhealth
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.philhealthDeduction
                          : employeeData.philhealthDeduction
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing ? editedData.pagibig : employeeData.pagibig
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
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
                      value={
                        isEditing
                          ? editedData.pagibigDeduction
                          : employeeData.pagibigDeduction
                      }
                      readOnly={!isEditing}
                      onChange={handleChange} // dapat 0-100 lang to
                      className="input"
                      required
                    />
                    <span className="placeholder">Pagibig Deduction</span>
                  </label>
                </div>
              </div>

              <div className="extras-deductions-form">
                <h2>Submit Extras and Deductions</h2>
                <div className="text-fields">
                  <label htmlFor="date">Date:</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                  <div className="extras">
                    <label className="field">
                      <input
                        type="number"
                        name="extras"
                        id="extras"
                        value={extras}
                        onChange={(e) => setExtras(e.target.value)}
                        className="input"
                        required
                      />
                      <span className="placeholder">Extras</span>
                    </label>
                    <label className="field">
                      <input
                        type="text"
                        name="extrasReason"
                        id="extrasReason"
                        value={extrasReason}
                        onChange={(e) => setExtrasReason(e.target.value)}
                        className="input"
                        required
                      />
                      <span className="placeholder">Reason for Extras</span>
                    </label>
                  </div>
                  <div className="deductions">
                    <label className="field">
                      <input
                        type="number"
                        name="deductions"
                        id="deductions"
                        value={deductions}
                        onChange={(e) => setDeductions(e.target.value)}
                        className="input"
                        required
                      />
                      <span className="placeholder">Deductions</span>
                    </label>
                    <label className="field">
                      <input
                        type="text"
                        name="deductionsReason"
                        id="deductionsReason"
                        value={deductionsReason}
                        onChange={(e) => setDeductionsReason(e.target.value)}
                        className="input"
                        required
                      />
                      <span className="placeholder">Reason for Deductions</span>
                    </label>
                  </div>
                </div>
                <div className="submit-extras-deductions">
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={submitExtrasAndDeductions}
                  >
                    Submit
                  </button>
                </div>
              </div>

              <div className="save-rec">
                {isEditing ? (
                  <div>
                    <button
                      type="button"
                      className="save-btn-rec"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="save-btn-rec"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      className="cancel-add"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="logs-container">
        <h2>Extras and Deductions Logs</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Extras</th>
              <th>Extras Reason</th>
              <th>Deductions</th>
              <th>Deductions Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.date}</td>
                <td>{isNaN(log.extras) ? "" : log.extras}</td>
                <td>{log.extrasReason}</td>
                <td>{isNaN(log.deductions) ? "" : log.deductions}</td>
                <td>{log.deductionsReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      <Footer />
    </>
  );
};

export default ViewProfile;
