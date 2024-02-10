import React, { useEffect } from 'react';
import './search.css'; 
import Header from '../components/header';
import Footer from '../components/footer';

const Search = () => {
    useEffect(() => {
        document.body.classList.add('searchPage');
    
        return () => {
          document.body.classList.remove('searchPage');
        };
    }, []); 

    return (
        <>  
            <Header />
            
            <div className="search"> 
                <img className="logo-search" src="/logo-1.png" alt="" />
                <img className="sgh-search" src="/sgh.png" alt="" />
                <form className="searchForm">
                    <div className="search-box">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="search-icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input className="search-input" name="search" type="text" placeholder="Search Record" />
                    </div>
                    <button className="btn-search">Search</button>
                </form>

            </div>

            <Footer />
        </>
    )
}

export default Search;