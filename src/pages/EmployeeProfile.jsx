import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";

const EmployeeProfile = (props) => {
  // Access the userEmployeeID parameter from the URL
  const { userEmployeeID } = useParams();

  const navigate = useNavigate();

  const location = useLocation();
  const loggedInEmployeeID =
    location.state && location.state.loggedInEmployeeID;

  useEffect(() => {
    console.log("loggedInEmployeeID:", loggedInEmployeeID);
    console.log("location state:", location.state);

    if (userEmployeeID !== loggedInEmployeeID) {
      console.log("Unauthorized");
      navigate("/Unauthorized");
    }
  }, []);

  return (
    <>
      <Header />
      <h1>Employee Profile</h1>
      <p>User Employee ID: {userEmployeeID}</p>
      <p>Logged In Employee ID: {loggedInEmployeeID}</p>
    </>
  );
};

export default EmployeeProfile;
