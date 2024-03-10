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
      <div className="form-container">
        <form>
          <div className="upload-img">
            <div className="preview">
              <img
                src={employeeData.imageUrl}
                alt="Employee"
                style={{ maxWidth: "200px" }}
              />
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
                      value={employeeData.firstName}
                      readOnly
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
                      value={employeeData.lastName}
                      readOnly
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
                      value={employeeData.middleName}
                      readOnly
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
                      value={employeeData.contactNumber}
                      readOnly
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
                      value={employeeData.email}
                      readOnly
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
                      value={employeeData.dateOfBirth}
                      readOnly
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
                      value={employeeData.age}
                      readOnly
                      className="input"
                    />
                    <span className="placeholder">Age</span>
                  </label>
                </div>
                <div className="gender">
                  <label className="field">
                    <input
                      type="text"
                      name="gender"
                      id="gender"
                      value={employeeData.gender}
                      readOnly
                      className="input"
                      required
                    />
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
                      value={employeeData.street}
                      readOnly
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
                      value={employeeData.city}
                      readOnly
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
                      value={employeeData.province}
                      readOnly
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
                      value={employeeData.barangay}
                      readOnly
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
                      value={employeeData.lotNumber}
                      readOnly
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
                      value={employeeData.department}
                      readOnly
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
                      value={employeeData.position}
                      readOnly
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
                      value={employeeData.dateHired}
                      readOnly
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
                      value={employeeData.salaryPerMonth}
                      readOnly
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
                      value={employeeData.role}
                      readOnly
                      className="input"
                      required
                    />
                    <span className="placeholder">System Role</span>
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
                      value={employeeData.tin}
                      readOnly
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
                      value={employeeData.prc}
                      readOnly
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
                      value={employeeData.prcExpiry}
                      readOnly
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
                      value={employeeData.sss}
                      readOnly
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
                      value={employeeData.sssDeduction}
                      readOnly
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
                      value={employeeData.philhealth}
                      readOnly
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
                      value={employeeData.philhealthDeduction}
                      readOnly
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
                      value={employeeData.pagibig}
                      readOnly
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
                      value={employeeData.pagibigDeduction}
                      readOnly
                      className="input"
                      required
                    />
                    <span className="placeholder">Pagibig Deduction</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  ) : null;
};

export default EmployeeProfile;
