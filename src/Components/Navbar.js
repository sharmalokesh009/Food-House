import axios from "axios";
import React, { useReducer, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../Icons/Logo";
import { backendurl } from "../url";

export default function Navbar(props) {
  axios.defaults.withCredentials = props.credentials;
  const reducer = (state, action) => {
    switch (action.type) {
      case "toggled":
        return { toggled: !state.toggled };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, { toggled: true });
  const navref = useRef(null);
  const burger1ref = useRef(null);
  const burger2ref = useRef(null);
  const burger3ref = useRef(null);

  const handlenavbar = () => {
    dispatch({ type: "toggled" });

    if (state.toggled) {
      burger3ref.current.style.display = "none";
      navref.current.style.animation = "navanimation1 1s";
      burger1ref.current.style.animation = "burgeranimation1 1s";
      burger2ref.current.style.animation = "burgeranimation2 1s";
      setTimeout(() => {
        navref.current.style.animationPlayState = "paused";
        burger1ref.current.style.animationPlayState = "paused";
        burger2ref.current.style.animationPlayState = "paused";
      }, 900);
    } else {
      navref.current.style.animation = "navanimation2 1s";
      burger1ref.current.style.animation = "burgeranimation3 1s";
      burger2ref.current.style.animation = "burgeranimation4 1s";

      setTimeout(() => {
        burger3ref.current.style.display = "block";
      }, 500);
      setTimeout(() => {
        navref.current.style.animationPlayState = "running";
        burger1ref.current.style.animationPlayState = "running";
        burger2ref.current.style.animationPlayState = "running";
        burger3ref.current.style.display = "block";
      }, 900);
    }

    
  };

  const handlelogout = async () => {
    
    await axios.post(`${backendurl.url}logout`).then((res) => {
    
      setTimeout(() => {
        window.location.reload();
      }, 15);
    });
  };

  return (
  
      <div className="navbar-container">
        <div className="navbar">
          <Link style={{ color: props.color }} className="title" to="/">
            <Logo />
            Food House
          </Link>
          <div
            className="right-items"
            style={{ gridTemplateColumns: props.columns }}
          >
            <Link style={{ color: props.color }} to="/support">
              Contact
            </Link>
            <Link style={{display: props.logout, color: props.color }} to="/home">
              Home
            </Link>
            <Link style={{display: props.logout,color: props.color}} to="/cart">Cart</Link>
            <p
              onClick={handlelogout}
              style={{
                color: "black",
                display: props.logout,
                textDecoration: "underline",
              }}
            >
              Logout
            </p>
          </div>
        </div>
        <div className="mobile" onClick={handlenavbar}>
          <p
            id="first"
            style={{ backgroundColor: props.color }}
            ref={burger1ref}
          ></p>
          <p
            id="second"
            style={{ backgroundColor: props.color }}
            ref={burger2ref}
          ></p>
          <p
            id="third"
            style={{ backgroundColor: props.color }}
            ref={burger3ref}
          ></p>
        </div>
        <div className="links" ref={navref}>
          <Link to="/">Food House</Link>
          <Link to="/support">Contact</Link>
          <Link to="/home">Home</Link>
          <Link style={{display: props.logout}} to="/cart">Cart</Link>
         
          <p
            onClick={handlelogout}
            style={{
              color: "black",
              display: props.logout,
              textDecoration: "underline",
            }}
          >
            Logout
          </p>
        </div>
      </div>
    
  );
}
