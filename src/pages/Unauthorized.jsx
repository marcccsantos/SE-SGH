import React from "react";
import { useNavigate } from "react-router-dom";
import "./not-found.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-2); // Go back to the previous page
  };

  return (
    <div className="not-found">
      <img className="broken-hand" src="/broken-hand.png" alt="" />
      <div className="container-not">
        <div className="err">401 Unauthorized </div>
        <div className="err-text">
          Sorry, but you are not authorized to view this page.
        </div>
        <button className="button-err" onClick={goBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
