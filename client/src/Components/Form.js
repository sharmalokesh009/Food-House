import React, { useEffect, useReducer, useState } from "react";
import Logo from "../Icons/LogoIcon";
import Navbar from "./Navbar";
import {  Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingIcon from "../Icons/Loading";
import { backendurl } from "../url";

export default function Form(props) {
  axios.defaults.withCredentials = true;
  document.querySelector("body").style.backgroundColor = "black";
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${backendurl.url}loggedin`).then((res) => {
    
      if (res.data) {
        navigate("/home");
      }
    }
    );
    
    
  },[navigate]);
  

  

  const reducer = (state, action) => {
    switch (action.type) {
      case "login":
        return { login: true, signup: false };
      case "signup":
        return { login: false, signup: true };
      case "otptrue":
        return { otp: true, login: true };
      case "otpfalse":
        return { otp: false, login: true };
      case "otpsent":
        return { otpsent: true, otp: true, login: true };
      case "otpnotsent":
        return { otpsent: false, otp: true, login: true };
      case "signuploadingtrue":
        return { signuploading: true, login: false, signup: true };
      case "signuploadingfalse":
        return { signuploading: false, login: false, signup: true };
      case "loginloadingtrue":
        return { loginloading: true, login: true, signup: false };
      case "loginloadingfalse":
        return { loginloading: false, login: true, signup: false };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    setflag: false,
    login: props.login,
    signup: props.signup,
    otp: props.otp,
    otpsent: false,
    signuploading: false,
    loginloading: false,
  });
  const [currentnumber, setcurrentnumber] = useState(String);
  const [currentotp, setcurrentotp] = useState(Number);
  const [generatedotp, setgeneratedotp] = useState(Number);
  const [currentsignuppassword, setcurrentsignuppassword] = useState(String);
  const [currentloginpassword, setcurrentloginpassword] = useState(String);
  const [credentials, setcredentials] = useState(false);
  const [currentsignupconfirmpassword, setcurrentsignupconfirmpassword] =
    useState(String);
  const usersignupdetails = {
    PhoneNumber: parseInt(currentnumber),
    Password: currentsignuppassword,
  };
  const userlogindetails = {
    PhoneNumber: parseInt(currentnumber),
    Password: currentloginpassword,
  };
  const handlephonenumber = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      setcurrentnumber(value);
    }
  };
  
  const handlesignuppassword = (e) => {
    const value = e.target.value;
    setcurrentsignuppassword(value);
  };
  const handlesignupconfirmpassword = (e) => {
    const value = e.target.value;
    setcurrentsignupconfirmpassword(value);
  };

  const handleloginpassword = (e) => {
    const value = e.target.value;
    setcurrentloginpassword(value);
  };

  const handleotp = (e) => {
    const value = parseInt(e.target.value);
    setcurrentotp(value);
  };

  const postsignupdata = async () => {
    dispatch({ type: "signuploadingtrue" });
    setcredentials(false)
    await axios
      .post(`${backendurl.url}signup`, usersignupdetails)
      .then((res) => {
      
        if (res.data === "Inserted") {
          dispatch({ type: "signuploadingfalse" });
         
        } else {
          alert("Account exists");
          dispatch({ type: "signuploadingfalse" });
        }
      });
  };
  const postlogindata = async () => {
    dispatch({ type: "loginloadingtrue" });
    await axios
      .post(`${backendurl.url}login`, userlogindetails)
      .then((res) => {
        
        if (res.data === "user found") {
          dispatch({ type: "loginloadingtrue" });
          navigate("/home");
        }
        if (res.data === "wrong password") {
          dispatch({ type: "loginloadingtrue" });
          alert("Wrong Password");
          dispatch({ type: "loginloadingfalse" });
        }
        if (res.data === "user not found") {
          dispatch({ type: "loginloadingtrue" });
          alert("User not found");
          dispatch({ type: "loginloadingfalse" });
        }
      });
  };
  const postotpuser = async () => {
    dispatch({ type: "loginloadingtrue" });
    await axios
      .post(`${backendurl.url}otpuser`, {
        PhoneNumber: currentnumber,
      })
      .then((res) => {
     
        if(res.data === "user found"){
          dispatch({ type: "loginloadingfalse" });
          navigate('/home')
        }
      });
  };
  const handlesubmit = (e) => {
    e.preventDefault();

    if (state.signup) {
   
      if (currentnumber.length === 0) {
        alert("Phone Number required !");
      } else {
        
        if (currentsignuppassword.length === 0) {
          alert("Password required !");
        } else {
          if (currentsignuppassword !== currentsignupconfirmpassword) {
            alert("Passwords doesn't match");
          } else {
            postsignupdata();
          }
        }
      }
    }

    if (state.login) {
      if (state.otp) {
        if (currentnumber.length === 0) {
          alert("Phone Number required !");
        } else {
          if (currentotp.length === 0) {
            alert("Enter OTP");
          } else {
            if (currentotp === generatedotp) {
              setcredentials(false);
              postotpuser();
            } else {
              alert("Wrong OTP");
            }
          }
        }
      } else {
        setcredentials(false);
        if (currentnumber.length === 0) {
          alert("Phone Number required !");
        } else {
          if (currentloginpassword.length === 0) {
            alert("Password required !");
          } else {
            postlogindata();
          }
        }
      }
    }
    e.preventDefault();
  };

  const sendotptouser = async (number) => {
    
    const otp = Math.floor(Math.random() * (9999 - 1500) + 1500);
    setgeneratedotp(otp);
    await axios
      .get(
        `https://www.fast2sms.com/dev/bulkV2?authorization=WJL3wUsth5G0iqaT6rPeZzEXCQMH1kd9jg8RxScvyp7mNKBIF2Yb5djN9cf0FGqKenh7Xvl2stoyHITO&variables_values=${otp}&route=otp&numbers=${number}`
      )
      .then((res) => {
       console.log(res);
      });
    dispatch({ type: "otpnotsent" });
    setcredentials(false);
  };
  const postotpdata = async () => {
    dispatch({ type: "otpsent" });
    await axios
      .post(`${backendurl.url}otp`, {
        PhoneNumber: currentnumber,
      })
      .then((res) => {
        if (res.data === "user found") {
          sendotptouser(currentnumber);
        } else {
          dispatch({ type: "otpnotsent" });
          alert("User not found ");
        }
      });
  };
  const sendotp = (e) => {
    e.preventDefault();
    setcredentials(true);
  

    if (currentnumber.length === 0) {
      alert("Phone Number required !");
    } else {
      postotpdata();
    }
  };

  const clicklogin = () => {
    dispatch({ type: "login" });
    setTimeout(() => {
      window.location.reload();
    }, 10);
  };
  const clicksignup = () => {
    dispatch({ type: "signup" });
    setTimeout(() => {
      window.location.reload();
    }, 10);
  };

  return (
  
      <div className="form-container">
        <Navbar
          color="white"
          columns="auto auto "
          credentials={credentials ? false : true}
          account="none"
        />
        <br />
        <br />
        <br />
        <Logo />
        <br />
        <form>
          <div className="links">
            <Link
              to="/login"
              style={{ color: state.login ? "#E7A422" : "white" }}
              onClick={clicklogin}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{ color: state.signup ? "#E7A422" : "white" }}
              onClick={clicksignup}
            >
              Signup
            </Link>
          </div>
          {state.signup ? (
            <div className="inputs">
              <div className="phonenumber">
                <input
                  type="text"
                  onChange={handlephonenumber}
                  placeholder="Phone Number"
                />
              </div>
              <input
                type="password"
                onChange={handlesignuppassword}
                placeholder="Password"
              />
              <input
                type="password"
                onChange={handlesignupconfirmpassword}
                placeholder="Confirm Password"
              />
            </div>
          ) : state.otp ? (
            <div className="inputs">
              <div className="phonenumber">
                <input
                  type="text"
                  onChange={handlephonenumber}
                  placeholder="Phone Number"
                />
              </div>

              <input type="number" onChange={handleotp} placeholder="OTP" />
              {!state.otpsent ? (
                <button onClick={sendotp}>Send OTP</button>
              ) : (
                <LoadingIcon />
              )}
              <Link
                className="forgot"
                to="/"
                onClick={() => {
                  dispatch({ type: "otpfalse" });
                  setTimeout(() => {
                    window.location.reload();
                  }, 10);
                }}
              >
                Login via Password{" "}
              </Link>
            </div>
          ) : (
            <div className="inputs">
              <div className="phonenumber">
                <input
                  type="text"
                  onChange={handlephonenumber}
                  placeholder="Phone Number"
                />
              </div>
              <input
                type="password"
                onChange={handleloginpassword}
                placeholder="Password"
              />
              <Link className="forgot" to="/forgot">
                Forgot Password ?{" "}
              </Link>
              <Link
                className="forgot"
                to="/otp"
                onClick={() => {
                  dispatch({ type: "otptrue" });
                  axios.defaults.withCredentials = true;
                  setTimeout(() => {
                    window.location.reload();
                  }, 10);
                }}
              >
                Login via OTP{" "}
              </Link>
            </div>
          )}
          {state.login ? (
            !state.loginloading ? (
              <button onClick={handlesubmit}>Login</button>
            ) : (
              <LoadingIcon />
            )
          ) : !state.signuploading ? (
            <button onClick={handlesubmit}>Signup</button>
          ) : (
            <LoadingIcon />
          )}
        </form>
      </div>
    
  );
}
