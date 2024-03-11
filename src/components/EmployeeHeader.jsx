import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import "./header.css";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const header = () => {
  const { userEmployeeID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInEmployeeID =
    location.state && location.state.loggedInEmployeeID;

  const handleLogOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  const handleNavigateToPayroll = () => {
    navigate(`/EmployeePayroll/${userEmployeeID}`, {
      state: { loggedInEmployeeID },
    });
  };

  const handleNavigateToProfile = () => {
    navigate(`/EmployeeProfile/${userEmployeeID}`, {
      state: { loggedInEmployeeID },
    });
  };

  return (
    <>
      <header>
        <div className="img-header">
          <img className="logo-header" src="/logo-1.png" alt="" />
          <img className="sgh-text" src="/text-sgh.png" alt="" />
        </div>
        <nav className="nav">
          <ul>
            <div className="all-tab">
              <div className="tab">
                <li>
                  <span onClick={handleNavigateToProfile}>PROFILE</span>
                </li>
                <li>
                  <span onClick={handleNavigateToPayroll}>PAYROLL</span>
                </li>
              </div>
              <div className="logout">
                <li className="logout-btn" onClick={handleLogOut}>
                  LOGOUT
                </li>
              </div>
            </div>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default header;
