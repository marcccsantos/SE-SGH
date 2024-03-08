import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DefaultViewProfile.css";
import Header from "../components/header";
import Footer from "../components/footer";

const SearchProfile = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Redirect to ViewRecord with search query as URL parameter
    navigate(`/ViewProfile/${searchQuery}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Header />

      <div className="search-prof">
        <div className="container-search-prof">
          <div className="sgh-logo-profile">
            <img className="sgh-search-prof" src="/sgh.png" alt="" />
          </div>
        </div>
        <div className="searchForm">
          <div class="container-input">
            <input
              type="text"
              placeholder="Search EmployeeID"
              name="text"
              class="input-id"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
            <svg
              fill="#000000"
              width="20px"
              height="20px"
              viewBox="0 0 1920 1920"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SearchProfile;
