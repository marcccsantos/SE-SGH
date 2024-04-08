import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./header.css";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { CgLogOut } from "react-icons/cg";
import Hamburger from "hamburger-react";
import { motion } from "framer-motion";

const header = () => {
  const location = useLocation();
  const loggedInEmployeeID =
    location.state && location.state.loggedInEmployeeID;
  const [employeeData, setEmployeeData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (loggedInEmployeeID) {
      localStorage.setItem("loggedInEmployeeID", loggedInEmployeeID);
    }
  }, [loggedInEmployeeID]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const storedEmpId = localStorage.getItem("loggedInEmployeeID");
        const employeeQuery = query(
          collection(db, "employees_active"),
          where("employeeID", "==", storedEmpId)
        );
        const querySnapshot = await getDocs(employeeQuery);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          const { firstName, lastName, imageUrl } = docData;
          setFirstName(firstName);
          setLastName(lastName);
          setProfileImage(imageUrl);
          setEmployeeData(docData);
        } else {
          console.error("No employee found with the provided ID hello");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, []);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleSearch = () => {
    // Redirect to ViewRecord with search query as URL parameter
    const storedEmpId = localStorage.getItem("loggedInEmployeeID");
    navigate(`/ViewProfile/${storedEmpId}`);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu); // Toggle menu visibility
  };

  return (
    <>
      <header>
        <div className="navigation">
          <div className="img-header">
            <img className="logo-header" src="/logo-1.png" alt="" />
            <img className="logo-header-1" src="/sgh.png" alt="" />
          </div>
          <div className="container-list">
            <nav className="nav">
              <ul>
                <div className="all-tab">
                  <div className="tab whitespace-nowrap">
                    <li>
                      <Link to="/search">SEARCH RECORD</Link>
                    </li>
                    <li className="list-record">
                      RECORDS
                      <div className="dropdown">
                        <RiArrowDropDownLine />
                      </div>
                      <ul>
                        <li>
                          <Link to="/ViewRecord">VIEW RECORD</Link>
                        </li>
                        <li>
                          <Link to="/AddRecord">ADD RECORD</Link>
                        </li>
                        <li>
                          <Link to="/ArchiveRecord">ARCHIVE RECORD</Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/ViewProfile">VIEW PROFILE</Link>
                    </li>
                    <li>
                      <Link to="/Payroll">PAYROLL</Link>
                    </li>
                    <li>
                      <Link to="/DTR">DTR</Link>
                    </li>
                  </div>
                </div>
              </ul>
            </nav>
          </div>
        </div>
        <div className="profile">
          {/* mobile view */}
          <div className="mobile-container">
            <div className="menu" onClick={toggleMenu}>
              <Hamburger direction="left" />
            </div>
          </div>

          {/* desktop view */}
          <div className="profile-icon">
            <div className="icon">
              {profileImage && (
                <img src={profileImage} alt="Profile" className="header-img" />
              )}{" "}
              {!profileImage && <CgProfile className="header-img" />}
              <RiArrowDropDownLine className="arrow-down" />
            </div>
            <div className="profile-info">
              <div className="all-profile-info">
                <div className="icon-info">
                  {profileImage && (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="header-img-2"
                    />
                  )}{" "}
                  {!profileImage && <CgProfile className="header-img-2" />}
                </div>
                <div className="profile-information">
                  <div className="icon-name">
                    <p>
                      {toTitleCase(firstName)} {toTitleCase(lastName)}
                    </p>
                  </div>
                  <div className="view-profile-info">
                    <p onClick={handleSearch}>My Profile</p>
                  </div>
                  <div className="logout">
                    <div className="logout-container" onClick={handleLogOut}>
                      <div className="icon-logout">
                        <CgLogOut />
                      </div>
                      <p>Logout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="profile-mobile"
        >
          <div className="profile-information-mobile">
            {profileImage && (
              <img src={profileImage} alt="Profile" className="header-img-2" />
            )}{" "}
            {!profileImage && <CgProfile className="header-img-2" />}
            <p className="icon-name-mobile">
              {toTitleCase(firstName)} {toTitleCase(lastName)}
            </p>
            <p onClick={handleSearch} className="view-profile-mobile">
              My Profile
            </p>
            <ul>
              <li>
                <Link to="/search">SEARCH RECORD</Link>
              </li>
              <li>
                <Link to="/ViewRecord">VIEW RECORD</Link>
              </li>
              <li>
                <Link to="/AddRecordFinal">ADD RECORD</Link>
              </li>
              <li>
                <Link to="/ArchiveRecord">ARCHIVE RECORD</Link>
              </li>
              <li>
                <Link to="/ViewProfile">VIEW PROFILE</Link>
              </li>
              <li>
                <Link to="/PayrollFinal">PAYROLL</Link>
              </li>
            </ul>
            <div className="logout-container-mobile" onClick={handleLogOut}>
              <div className="icon-logout-mobile">
                <CgLogOut />
              </div>
              <p>LOGOUT</p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default header;
