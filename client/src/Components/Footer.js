import React from "react";
import { Link } from "react-router-dom";

export default function Footer(props) {
  return (
  
      <div className="footer-container" style={{marginTop : props.margintop}}>
        <div className="upper">
          <Link to="/terms" style={{color:props.color}}>Terms of Use</Link>
          <Link to="/privacy" style={{color:props.color}}>Privacy Policy</Link>
          <Link to="/disclaimer" style={{color:props.color}}>Disclaimer</Link>
        </div>
        <div className="middle">
        <i className="fab fa-instagram"></i>
          <i className="fab fa-facebook"></i>
          <i className="fab fa-twitter"></i>
          
        </div>
        
        <p>Copyright 1999-2021 by Refsnes Data. All Rights Reserved.</p>
        
      </div>
    
  );
}
