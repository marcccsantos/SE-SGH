import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./search.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { CiSearch } from "react-icons/ci";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const navigate = useNavigate();

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  useEffect(() => {
    document.body.classList.add("searchPage");

    return () => {
      document.body.classList.remove("searchPage");
    };
  }, []);

  const handleSearch = () => {
    // Redirect to ViewRecord with search query as URL parameter
    navigate(`/ViewRecord/${searchQuery}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Header />

      <div className="search bg-[#00000030]">
        <img className="logo-search" src="/logo-1.png" alt="" />
        <img className="sgh-search" src="/sgh.png" alt="" />
        <div className="bg-white flex flex-row justify-center items-center rounded-md text-sm md:text-base font-inter shadow-lg pl-2 mt-2">
          <CiSearch className="text-xl mr-2 font-semibold" />
          <input
            className={`p-1 px-2 outline-none border-l border-black ${
              isInputFocused || searchQuery
                ? "border-r-0 border-t-0 border-b-0"
                : ""
            }`}
            name="search"
            type="text"
            placeholder="Search Record"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="off"
          />
          <button
            className="ml-2 bg-[#176906] text-white rounded-r-md py-2 px-3 hover:bg-[#155e06]"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {/* <div className="searchForm">
          <div className="search-box">
            
            <input
              className="search-input"
              name="search"
              type="text"
              placeholder="Search Record"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
          </div>
          <button className="btn-search" onClick={handleSearch}>
            Search
          </button>
        </div> */}
      </div>

      <Footer />
    </>
  );
};

export default Search;
