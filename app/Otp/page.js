import { React, useState, useEffect } from "react";
import OTPInput from "otp-input-react";
import { Redirect } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import { useState, useEffect } from 'react';
import { useNavigation } from 'next/navigation';
import { useClient } from 'next/client';
const Otp = () => {
    const router = useNavigation();
    const { client } = useClient(); 
    const { PrismaClient } = require('@prisma/client');
    
    const prisma = new PrismaClient();
  
  const [OTP, setOTP] = useState("");
  // const navigate = useNavigate();
  const otpSent = JSON.parse(localStorage.getItem("otp"));
  const emailValue=JSON.parse(localStorage.getItem("email"));
  const [redirect, setRedirect] = useState(false);
 

  const starredEmail=emailValue.length<14? emailValue[0]+ "***"+"@gmail.com":emailValue.slice(0,3)+ "*******"+"@gmail.com"

  

  useEffect(() => alert(`Please Copy Your OTP: ${otpSent}`), []);

  const onVerify = (event) => {
    event.preventDefault()
    if (parseInt(otpSent) === parseInt(OTP)) {
      setRedirect(true)
    } else {    
      alert("invaild OTP");
    }
  };

  
  if (redirect) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
    <Header/>
    <div className="con d-flex flex-column justify-content-start align-items-center mt-3">
      <form className=" text-center form-con p-4  mt-3 d-flex flex-column">
        <h4 className="mt-3">Verify your Email</h4>
        <p className="mt-3">
          Enter the 8 digit code you have received on {starredEmail}
        </p>

        <OTPInput
          className="mt-3 mb-3"
          value={OTP}
          onChange={setOTP}
          autoFocus
          OTPLength={8}
          otpType="number"
          disabled={false}
        />

        <button
          className="btn btn-dark mt-3 mb-3"
          type="submit"
          onClick={onVerify}
        >
          Verify
        </button>
      </form>
    </div>
    </div>
  );
};
export default Otp;
