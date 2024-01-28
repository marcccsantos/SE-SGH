import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './login.css'; 

const Login = () => {
  const [password, setPassword] = useState(false);
 
  const passwordVisibility = () => {
    setPassword(!password);
  };

  useEffect(() => {
    document.body.classList.add('loginPage');

    return () => {
      document.body.classList.remove('loginPage');
    };
  }, []);

  return ( 
    <>
      <div className="login-page">
        <div className="group-left">
          <img className="green-pattern" alt="" src="/green-pattern.png" />
          <div className="logo-left">
            <img className="logo" src="/logo-1.png" alt="" />
          </div>
          <p className="copyright">COPYRIGHTS © 2023 ALL RIGHTS RESERVED</p>
        </div>

        <div className="group-right">
          <img className="white-pattern" alt="" src="/white-pattern.png" />
          <div className="bg-right">
            <img className="bg" alt="" src="/bg.png" />
          </div>
          <img className="welcome-img" alt="" src="/welcome.png" />

          <form action="">
            <input
              type="text"
              placeholder="Enter Username"
              className="username"
              required
            />

            <input
              type={password ? 'text' : 'password'}
              placeholder="Enter Password"
              className="password"
              id="input"
              required
            />
            {password ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="eye-btn" onClick={passwordVisibility}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="eye-slash-btn" onClick={passwordVisibility}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            )}

            <button className="login-button" type="submit">
              LOGIN
            </button>
          </form>

          <Link to="/forgot" className="forgot-password">
            Forgot Password?
          </Link>
          <img className="stethoscope" src="/stethoscope.png" alt="" />
        </div>
      </div>
    </>
  );
};

export default Login;