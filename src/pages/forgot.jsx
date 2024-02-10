import React, { useEffect } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from 'react-router-dom';
import './forgot.css'; 

function ForgotPassword(){
    const history = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const emalVal = e.target.email.value;
        sendPasswordResetEmail(auth,emalVal).then(data=>{
            alert("Password reset email sent successfully!")
            history("/")
        }).catch(err=>{
            alert(err.code)
        })
    }

    useEffect(() => {
      document.body.classList.add('forgotPage');
  
      return () => {
        document.body.classList.remove('forgotPage');
      };
    }, []); 

    return(
        <div className="forgot">
          <div className="forgot-card">
              <h1 className="forgot-text">Forgot Password?</h1>
              <p className="info-forgot">Please enter your email address below to receive a password reset link.</p>
              <form onSubmit={(e)=>handleSubmit(e)}>
                  <input 
                    className="email-forgot"
                    name="email"
                    placeholder="Email Address" 
                    required
                  />
                  <button className="btn-reset">Send Reset Link</button>
              </form>
              <div className="back">
                <Link to="/" className="forgot-back">
                  Back to log in
                </Link>
              </div>
            </div>
        </div>
    )
}
export default ForgotPassword;