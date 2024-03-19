import React, { useState, useEffect } from "react";
import "./loading.css";

const Loading = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000); // 1000 milliseconds = 1 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loader-container ${showLoader ? "show" : "hide"}`}>
      <div className="loader"></div>
      <div className="loader-text">Loading...</div>
    </div>
  );
};

export default Loading;
