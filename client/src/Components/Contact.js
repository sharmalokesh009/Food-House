import React from "react";
import Navbar from "./Navbar";

export default function Contact(){
    document.querySelector("body").style.backgroundColor = "White"
    return <div className="contact-container">
        <Navbar color="black" columns="auto auto " logout="none" />
        <br/><br/>
        <p className="haveanyquery" >Have any Query ? </p>
        <br/>
        <div>
        <p className="mailus">Mail us at : </p>
        <a className="email" href='mailto:foodhousehelp@gmail.com' >foodhousehelp@gmail.com</a>
        </div>
     
    </div>
}