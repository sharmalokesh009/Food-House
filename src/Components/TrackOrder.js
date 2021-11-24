import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CurrentLocationIcon from "../Icons/CurrentLocationIcon";
import DeliveredIcon from "../Icons/DeliveredIcon";

import ReceivedIcon from "../Icons/ReceivedIcon";
import { backendurl } from "../url";

import Navbar from "./Navbar";

export default function TrackOrder(props) {
  const navigate = useNavigate();
  document.querySelector("body").style.backgroundColor = "white";
  const [Completed , setcompleted] = useState(String)
  const [totalwidth , settotalwidth] = useState(Number)
  useEffect(() => {
    
    axios.get(`${backendurl.url}loggedin`).then((res) => {
     console.log(res.data);
      if (!res.data) {
        navigate("/");
      }
    });
  },[navigate]);
  useEffect(() => {
   
    if(document.querySelector("body").scrollWidth > 900){
      settotalwidth(900)
    }
    if(document.querySelector("body").scrollWidth < 900){
      settotalwidth(300)
    }
    if(props.Completed >= "25%"){
      setcompleted(`${totalwidth * 0.25}px`)
     
    }
    if(props.Completed >= "50%"){
      setcompleted(`${totalwidth * 0.50}px`)
     
    }
    if(props.Completed >= "75%"){
      setcompleted(`${totalwidth * 0.75}px`)
     
    }
    if(props.Completed === "100%"){
      setcompleted(`${totalwidth}px`)
   
    }
  },[ totalwidth , props.Completed])

  return (
    <div className="trackorder-container">
      <Navbar color="black" credentials={true}   columns="auto auto auto auto" />

      <h1>Track your Order</h1>
      <br />
      <br />
      <div className="current-track-line"  style={{width:totalwidth}}>
        <div style={{width:Completed}}>
          <p>
            <CurrentLocationIcon />
          </p>
        </div>
      </div>
      <div className="track-line" style={{width:totalwidth}}>
        <p className="order-received">
          <ReceivedIcon />
          <br />
          Order <br />
          Received
        </p>
        <p className="order-delivered">
          <DeliveredIcon />
          <br />
          Order
          <br /> Delivered
        </p>
      </div>
      <br/><br/><br/><br/><br/>
      <h2 style={{width:"300px" , textAlign:"center"}}>{props.Completed === "100%" ? "Your Order is Delivered" :`Your Order will be arrived at ${props.DeliveryTime}`}</h2>
 
      <h3 >Order not delivered ?</h3>
      <br/>
      <div className="query">
        <p style={{ fontWeight: "bolder" , textAlign:"center" }}>Mail us your Query</p>
        <a
          style={{ color: "#e7a422", fontWeight: "bolder" }}
          href="https://mail.google.com/mail/?view=cm&fs=1&to=foodhousehelp@gmail.com"
        >
          foodhousehelp@gmail.com
        </a>
      </div>
      <br />
      <p style={{ fontWeight: "bolder" }}>Your Order Id</p>
      
      <p>{props.orderid}</p>
    </div>
  );
}
