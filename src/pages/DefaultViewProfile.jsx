import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DefaultViewProfile.css";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import Header from "../components/header";
import Footer from "../components/footer";

const SearchProfile = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeQuery = query(
          collection(db, "employees_active"),
          orderBy("employeeID")
        );
        const querySnapshot = await getDocs(employeeQuery);
        const employeeDetails = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          const {
            imageUrl,
            firstName,
            lastName,
            employeeID,
            department,
            position,
          } = docData;
          employeeDetails.push({
            imageUrl,
            fullName: `${firstName} ${lastName}`,
            employeeID,
            department,
            position,
          });
        });
        setEmployeeData(employeeDetails);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, []);

  const handleSearch = () => {
    // Redirect to ViewRecord with search query as URL parameter
    navigate(`/ViewProfile/${searchQuery}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleClickProfile = (employeeID) => {
    navigate(`/ViewProfile/${employeeID}`);
  };

  return (
    <>
      <Header />

      <div className="min-h-lvh ">
        <div className="mt-5 flex justify-start mx-3 md:ml-8">
          <div className="flex">
            <div className="flex items-center justify-center p-3">
              <div className="rounded-lgk p-1">
                <div className="flex border-2 border-black rounded-lg">
                  <div className="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white p-5">
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="pointer-events-none absolute w-5 fill-gray-500 transition"
                    >
                      <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
                    </svg>
                  </div>
                  <input
                    type="number"
                    placeholder="EmployeeID"
                    name="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoComplete="off"
                    className="without_number w-full max-w-[160px] bg-white pl-2 md:text-base font-medium outline-0 text-sm"
                  />
                  <input
                    type="button"
                    value="Search"
                    className="bg-[#176906] p-2  text-white font-semibold hover:bg-[#155e06] transition-colors md:text-base text-sm"
                    onClick={handleSearch}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" md:m-8 mx-3 mb-5 grid md:grid-cols-2 bg-[#e8e8e8]">
          {employeeData ? (
            employeeData.map((employee, index) => (
              <div
                key={index}
                className=" p-3"
                onClick={() => handleClickProfile(employee.employeeID)}
              >
                <div className="hover:border-[#176906] border-2 border-white rounded  hover:bg-[#176906] bg-white">
                  <div className="border-2 border-black flex flex-row p-3 rounded bg-white cursor-pointer">
                    <div className="border border-black rounded w-[80px] md:w-[90px] flex items-center justify-center">
                      <img
                        src={employee.imageUrl}
                        alt="Profile"
                        className="md:min-w-[90px] md:max-h-[90px] p-1 min-w-[80px] max-h-[80px]"
                      />
                    </div>
                    <div className="flex flex-col ml-3 overflow-x-scroll no-scrollbar">
                      <p className="font-poppins font-semibold md:text-lg md:whitespace-nowrap">
                        Name: {toTitleCase(employee.fullName)}
                      </p>
                      <div className="font-inter font-medium text-[14px]">
                        <p>Employee ID: {employee.employeeID}</p>
                        <p>Department: {employee.department}</p>
                        <p>Position: {employee.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="fixed inset-0 flex items-center justify-center w-full h-lvh bg-white">
              <div className="absolute flex flex-col items-center justify-center bg-white p-8 ">
                <div className="loader-container">
                  <div className="loader"></div>
                  <div className="loader-text">Loading...</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SearchProfile;
