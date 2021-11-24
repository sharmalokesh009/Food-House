import React, { useRef, useState } from "react";
import Logo from "../Icons/Logo";
import Navbar from "./Navbar";
import axios from "axios";
import LoadingIcon from "../Icons/Loading";
import { backendurl } from "../url";
import { useNavigate } from "react-router";

export default function ForgotPassword() {
const navigate = useNavigate();
  const input1ref = useRef(null);
  const input2ref = useRef(null);
  document.querySelector("body").style.backgroundColor = "white";
  const [number, setnumber] = useState(0);
  const [otpsent, setotpsent] = useState(true);
  const [currentotp, setcurrentotp] = useState(Number);
  const [password, setpassword] = useState(String);
  const [confirmpassword, setconfirmpassword] = useState(String);
  const [loading, setloading] = useState(false);
  
  const checkuser = async (e) => {
   
    e.preventDefault();
    
    if (number === 0) {
      alert("Phone Number required !");
    } else {
      await axios
        .post(`${backendurl.url}forgot`, {
          PhoneNumber: number,
        })
        .then((res) => {
          if (res.data === "No user found") {
            alert("No user found");
          } else {
            sendotp();
          }
        });
    }
  };

  const sendotp = async () => {
    const otp = Math.floor(Math.random() * (9999 - 1500) + 1500);
    setotpsent(false);
    await axios
      .get(
        `https://www.fast2sms.com/dev/bulkV2?authorization=WJL3wUsth5G0iqaT6rPeZzEXCQMH1kd9jg8RxScvyp7mNKBIF2Yb5djN9cf0FGqKenh7Xvl2stoyHITO&variables_values=${otp}&route=otp&numbers=${number}`
      )
      .then((res) => {
      
        setotpsent(true);
        setcurrentotp(otp);
      });
  };

  const handleotp = (e) => {
    const value = parseInt(e.target.value);

    if (value === currentotp) {
      input1ref.current.disabled = false;
      input2ref.current.disabled = false;
      input1ref.current.style.opacity = 1;
      input2ref.current.style.opacity = 1;
    } else {
      input1ref.current.disabled = true;
      input2ref.current.disabled = true;
      input1ref.current.style.opacity = 0.3;
      input2ref.current.style.opacity = 0.3;
    }
  };

  const handlenumber = (e) => {
    setnumber(e.target.value);
  };

  const handlepassword = (e) => {
    const value = e.target.value;
    setpassword(value);
  };
  const handleconfirmpassword = (e) => {
    const value = e.target.value;
    setconfirmpassword(value);
  };

  const changepassword = async () => {
    setloading(true);
    await axios
      .post(`${backendurl.url}changepassword`, {
        PhoneNumber: number,
        Password: password,
      })
      .then((res) => {
        if (res.data === "changed") {
          setloading(false);
          alert("Your Password has been changed");
          navigate("/");
        }
      });
  };

  const handlecontinue = (e) => {
    e.preventDefault();
    if (password === confirmpassword) {
      changepassword();
    } else {
      alert("Passwords doesn't match");
    }
  };

  return (
    <div className="forgotpassword-container">
      <Navbar color="black" columns="auto auto " credentials={false}  logout="none" />
      <br />
      <Logo />
      <br />
      <p>Forgot Password ?</p>
      <br />
      <form>
        <input
          type="number"
          onChange={handlenumber}
          placeholder="Phone Number"
        />

        {otpsent ? (
          <button onClick={checkuser}>Send OTP</button>
        ) : (
          <LoadingIcon />
        )}

        <input type="number" onChange={handleotp} placeholder="OTP" />

        <input
          className="passwordinput"
          onChange={handlepassword}
          type="password"
          placeholder="New Password"
          ref={input1ref}
          disabled
        />
        <input
          className="passwordinput"
          onChange={handleconfirmpassword}
          type="password"
          placeholder="Confirm Password"
          ref={input2ref}
          disabled
        />
        {!loading ? (
          <button style={{ padding: "10px" }} onClick={handlecontinue}>
            Continue
          </button>
        ) : (
          <LoadingIcon />
        )}
      </form>
    </div>
  );
}
