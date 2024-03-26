import React, { useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import "./forgot.css";

function ForgotPassword() {
  const history = useNavigate();

  const handleSubmit = async (e) => {
    localStorage.removeItem("loginAttempts");
    e.preventDefault();
    const emalVal = e.target.email.value;
    sendPasswordResetEmail(auth, emalVal)
      .then((data) => {
        alert("Password reset email sent successfully!");
        history("/");
      })
      .catch((err) => {
        alert(err.code);
      });
  };

  useEffect(() => {
    document.body.classList.add("forgotPage");

    return () => {
      document.body.classList.remove("forgotPage");
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen p-2">
      <div className=" mx-2 bg-white p-10 rounded-md">
        <h1 className="font-inter font-bold md:text-[35px] text-[28px]">
          Forgot Password?
        </h1>
        <p className="font-inter text-sm md:w-80">
          Please enter your email address below to receive a password reset
          link.
        </p>
        <form
          className="mt-3 md:w-80 flex items-center flex-col"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            className="w-full border-2 border-black mb-3 p-1 pl-2 rounded text-[13px]"
            name="email"
            placeholder="Email Address"
            autoComplete="email"
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
  );
}
export default ForgotPassword;
