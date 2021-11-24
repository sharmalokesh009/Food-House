import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes ,  Route } from "react-router-dom";
import ForgotPassword from "./Components/ForgotPassword";
import Form from "./Components/Form";
import Home from "./Components/Home";
import Foodbycategory from "./Components/Foodbycategory";
import Cart from "./Components/Cart";
import Contact from "./Components/Contact";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import TermsandConditions from "./Components/TermsandConditions";
import Disclaimer from "./Components/Disclaimer";
import axios from "axios";
import { backendurl } from "./url";
import TrackOrder from "./Components/TrackOrder";

export default function App() {
  const [todayorders, settodayorders] = useState([]);
  useEffect(() => {
    axios.get(`${backendurl.url}todayorders`).then((res) => {
      settodayorders(res.data);
    
    });
  },[todayorders]);
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path='/' element={<Form login={true} signup={false} otp={false} />} />
          <Route path='/login' element={<Form login={true} signup={false} otp={false} />} />
          <Route path='/signup' element={<Form login={false} signup={true} otp={false} />} />
          <Route path='/forgot' element={<ForgotPassword />} />
          <Route path='/otp' element={ <Form login={true} signup={false} otp={true} />} />
          <Route path='/home' element={<Home />} />
          <Route path='/burgers' element={<Foodbycategory food="burgers" title="Burgers"/>} />
          <Route path='/wraps' element={<Foodbycategory food="wraps" title="Wraps"/>} />
          <Route path='/sandwiches' element={<Foodbycategory food="sandwiches" title="Sandwich"/>} />
          <Route path='/pizzas' element={<Foodbycategory food="pizzas" title="Pizza"/>} />
          <Route path='/pastas' element={<Foodbycategory food="pastas" title="Pasta"/>} />
          <Route path='/drinks' element={<Foodbycategory food="drinks" title="Drinks"/>} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/support' element={<Contact />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/terms' element={<TermsandConditions />} />
          <Route path='/disclaimer' element={<Disclaimer />} />

          
          {todayorders.map((order, index) => {
            return (
              <Route key={index} path={`/${order.Orderid}`} element={ <TrackOrder orderid = {order.Orderid} DeliveryTime={order.DeliveryTime} Completed={order.Completed}/>}/>
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}
