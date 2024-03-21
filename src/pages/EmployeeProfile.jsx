import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import Header from "../components/EmployeeHeader";
import Footer from "../components/footer";

import { db } from "../firebase";

const EmployeeProfile = () => {
  const { userEmployeeID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInEmployeeID =
    location.state && location.state.loggedInEmployeeID;

  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeQuery = query(
          collection(db, "employees_active"),
          where("employeeID", "==", loggedInEmployeeID)
        );
        const querySnapshot = await getDocs(employeeQuery);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setEmployeeData(docData);
        } else {
          console.error("No employee found with the provided ID");
          navigate("/Unauthorized");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    if (userEmployeeID !== loggedInEmployeeID) {
      console.log("Unauthorized");
      navigate("/Unauthorized");
    } else {
      fetchEmployeeData();
    }
  }, [loggedInEmployeeID, userEmployeeID]);

  return employeeData ? (
    <>
      <Header />
      <form className=" mx-5 md:mx-16 mt-8 mb-8 flex flex-col p-3 bg-[#e8e8e8] sm:min-h-lvh">
        <div className="flex items-center flex-col">
          <div className="font-inter w-full max-w-xs items-center gap-1.5">
            <div className=" flex justify-center items-center w-full h-[240px] mb-2 bg-white 0">
              <img
                src={employeeData.imageUrl}
                alt="Employee"
                style={{ maxWidth: "150px" }}
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
            <div className="grid grid-cols-2 w-full my-5 px-3 md:gap-y-0.5 gap-y-1 ">
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
                value={employeeData.firstName}
                readOnly
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
                value={employeeData.lastName}
                readOnly
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
                value={employeeData.middleName}
                readOnly
                required
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="contact"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Contact
              </label>
              <input
                type="text"
                name="contact"
                id="contact"
                value={employeeData.contactNumber}
                readOnly
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
                value={employeeData.email}
                readOnly
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
                value={employeeData.dateOfBirth}
                readOnly
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
                value={employeeData.age}
                readOnly
                required
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="gender"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Gender
              </label>
              <input
                type="text"
                name="gender"
                id="gender"
                value={employeeData.gender}
                readOnly
                required
                className=" py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
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
                value={employeeData.street}
                readOnly
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
                value={employeeData.city}
                readOnly
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
                value={employeeData.province}
                readOnly
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
                value={employeeData.barangay}
                readOnly
                required
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="lot"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Lot
              </label>
              <input
                type="text"
                name="lot"
                id="lot"
                value={employeeData.lotNumber}
                readOnly
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
                value={employeeData.tin}
                readOnly
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
                value={employeeData.prc}
                readOnly
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
                value={employeeData.prcExpiry}
                readOnly
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
                value={employeeData.sss}
                readOnly
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
                value={employeeData.sssDeduction}
                readOnly
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
                value={employeeData.philhealth}
                readOnly
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
                value={employeeData.philhealthDeduction}
                readOnly
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
                value={employeeData.pagibig}
                readOnly
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
                value={employeeData.pagibigDeduction}
                readOnly
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
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center  bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Department
              </label>
              <input
                type="text"
                name="department"
                id="department"
                value={employeeData.department}
                readOnly
                required
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="position"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center  bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Position
              </label>
              <input
                type="text"
                name="position"
                id="position"
                value={employeeData.position}
                readOnly
                required
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="hired"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center  bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Date Hired
              </label>
              <input
                type="date"
                name="hired"
                id="hired"
                value={employeeData.dateHired}
                readOnly
                required
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="salary"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center  bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Salary
              </label>
              <input
                type="number"
                name="salary"
                id="salary"
                value={employeeData.salaryPerMonth}
                readOnly
                required
                className="py-1 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 text-xs md:text-sm min-w-0 mr-1"
              />
              <label
                htmlFor="role"
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center  bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
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
                className="flex items-center justify-start pl-2 text-gray-800 font-semibold text-xs md:text-sm text-center  bg-[#7bbf6d] ml-1 min-w-0 min-h-[30px]"
              >
                Shift
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
      </form>

      <Footer />
    </>
  ) : null;
};

export default EmployeeProfile;
