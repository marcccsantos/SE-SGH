import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; 
import { auth, db} from "../firebase";
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [waitTime, setWaitTime] = useState(0); 

  const navigate = useNavigate(); 
 
  const passwordVisibility = () => {
    setPasswordVisibility(!passwordVisible);
  };

  useEffect(() => {
    document.body.classList.add('loginPage');

    return () => {
      document.body.classList.remove('loginPage');
    };
  }, []); 

  const handleLogin = async () => {
    if (!username || !password) return;
    signInWithEmailAndPassword(auth, username, password)
      .then(async(userCredential) => {
        const user = userCredential.user;
        {/*console.log(user);
        navigate('/search');*/}
        // Retrieve role information from Firestore
        try {
          const querySnapshot = await getDocs(collection(db, 'employees_active'));
          const results = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Check if 'email' matches the provided username
            if (data && data.email === username) {
              return { id: doc.id, role: data.role };
            } else {
                return null; // Or handle the case where 'role' field is missing
            }
          }).filter(Boolean); // Remove null entries
          console.log('Roles:', results);

          if (results.length > 0) {
            // If user data exists with matching email/username
            const userRole = results[0].role;
            // Perform actions based on user role
            if (userRole === 'admin') {
                console.log('User is admin');
                navigate('/search');
            } else if (userRole === 'employee') {
                console.log('User is user');
                navigate('/EmployeeProfile');
            } else {
                console.log('User role not recognized');
            }
        } else {
          setErrorMsg("Invalid username or password. Please try again.");
          setLoginAttempts(prevAttempts => prevAttempts + 1);
          if (loginAttempts === 2 && waitTime === 0) {
            setWaitTime(60); 
            startCountdown(); 
          }
          console.log(loginAttempts)
          console.log('No user found with the provided email/username');
        }

        } catch (error) {
          console.error('Error fetching records:', error);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setErrorMsg("Invalid username or password. Please try again.");
        setLoginAttempts(prevAttempts => prevAttempts + 1);
        if (loginAttempts === 2 && waitTime === 0) {
          setWaitTime(60); 
          startCountdown(); 
        }
        console.log(loginAttempts)
      });
  };

  const startCountdown = () => {
    if (waitTime > 0) {
      setTimeout(() => {
        setWaitTime(prevWaitTime => prevWaitTime - 1);
      }, 1000); 
    }
  };

  useEffect(() => {
    if (waitTime > 0) {
      const countdownInterval = setInterval(() => {
        setWaitTime(prevWaitTime => prevWaitTime - 1);
      }, 1000);
      return () => clearInterval(countdownInterval); 
    }
  }, [waitTime]);

  useEffect(() => {
    if (loginAttempts === 2 && waitTime === 0 ) {
      startCountdown();
    }
  }, [loginAttempts, waitTime]);

  useEffect(() => {
    if (loginAttempts === 3 && waitTime > 0) {
      const interval = setInterval(() => {
        setErrorMsg(`Please try again in ${waitTime} seconds.`);
      }, 1000);

      return () => clearInterval(interval);
    }else if (loginAttempts >= 3 && loginAttempts <= 5 && waitTime === 0) {
      setErrorMsg("Invalid username or password. Please try again.");
    }else if (loginAttempts >= 6){
      setErrorMsg("Reset your password.");
    }
  }, [loginAttempts, waitTime]);

  const handleUsername = (event) => setUsername(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
  }

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

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Username"
              className={`username ${errorMsg ? 'error-input' : ''}`} 
              name="username"
              autoComplete="username"
              required
              value = {username} onChange={handleUsername}
            />

            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Enter Password"
              className={`password ${errorMsg ? 'error-input' : ''}`}
              id="input"
              name="password"
              autoComplete="current-password"
              required
              value = {password} onChange={handlePassword}
            />
            {passwordVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="eye-btn" onClick={passwordVisibility}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="eye-slash-btn" onClick={passwordVisibility}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            )}

            <button className="login-button" onClick={handleLogin} disabled={waitTime > 0 || loginAttempts >= 6}>
              LOGIN
            </button>

            {errorMsg && (
              <p className={
                errorMsg.includes('Please try again in') ? 'countdown-error' :
                errorMsg === "Invalid username or password. Please try again." ? 'invalid-credentials' :
                errorMsg === "Reset your password." ? 'reset' : 'error-message'
              }>
                {errorMsg}
              </p>
            )}
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