import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import {  Link } from "react-router-dom";
import dotenv from "dotenv"
import { backendurl } from "../url";

export default function Home() {
  dotenv.config();
  document.querySelector("body").style.backgroundColor = "white";
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const successcallback = (position) => {
    // console.log(position);
  }
  const errorcallback = (position) => {
    // console.log(position);
  }

  navigator.geolocation.getCurrentPosition(successcallback , errorcallback);
  useEffect(() => {
    
    axios.get(`${backendurl.url}loggedin`).then((res) => {
     
      if (!res.data) {
        navigate("/");
      }
    });
  },[navigate]);

  return (
  
      <div className="home-container">
        <Navbar color="black" credentials={true}/>
        <div className="categories-container">
          <div>
            <img
              src={process.env.PUBLIC_URL + "/photos/burger.png"}
              alt="burger"
            />
            <Link to="/food" >BURGER</Link>
          </div>
          <div>
            <img
              src={process.env.PUBLIC_URL + "/photos/wrap.png"}
              alt="wraps"
            />
            <Link to="/wraps">WRAPS</Link>
          </div>
          <div>
            <img
              src={process.env.PUBLIC_URL + "/photos/sandwich.png"}
              alt="sandwich"
            />
            <Link to="/sandwich">SANDWICH</Link>
          </div>
          <div>
            <img
              src={process.env.PUBLIC_URL + "/photos/pizza.png"}
              alt="pizza"
            />
            <Link to="/pizza">PIZZA</Link>
          </div>
          <div>
            <img
              src={process.env.PUBLIC_URL + "/photos/pasta.png"}
              alt="pasta"
            />
            <Link to="/pasta">PASTA</Link>
          </div>
          <div>
            <img
              src={process.env.PUBLIC_URL + "/photos/drinks.png"}
              alt="drinks"
            />
            <Link to="/drinks">DRINKS</Link>
          </div>
        </div>
      </div>
    
  );
}
