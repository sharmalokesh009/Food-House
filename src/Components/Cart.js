import axios from "axios";
import React, { useEffect, useState } from "react";
import CancelIcon from "../Icons/CancelIcon";
import LoadingIcon from "../Icons/Loading";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { backendurl } from "../url";
import OrderPlaced from "./OrderPlaced";
import EmptyCartIcon from "../Icons/EmptyCart";

export default function Cart() {
  document.querySelector("body").style.backgroundColor = "white";
  const [orders, setorders] = useState([]);
  const [loading, setloading] = useState(false);
  const [paid, setpaid] = useState(false);
  const [currentorderid, setcurrentorderid] = useState(String);
  const [currentpaymentid, setcurrentpaymentid] = useState(String);
  const [currentphonenumber, setcurrentphonenumber] = useState(Number);
  const [currentamount, setcurrentamount] = useState(Number);
  const [paynowclicked, setpaynowclicked] = useState(false);
  const [userlocation , setuserlocation] = useState({
    Longitude : Number ,
    Latitude : Number
  })

  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((result,err) => {
      if(err){
        console.log(err);
      }else{
        console.log("hello");
        setuserlocation({
          Latitude : result.coords.latitude,
          Longitude : result.coords.longitude 
        })
        
      }
    })
    axios.get(`${backendurl.url}loggedin`).then((res) => {
      console.log(res.data);
      if (!res.data) {
       
        navigate("/");
        window.location.reload();
      } else {
        setcurrentphonenumber(parseInt(res.data[0]));
      }
    });
  },[navigate]);
  var totalprice = 0;
  for (let i = 0; i < orders.length; i++) {
    totalprice = totalprice + orders[i].Price * orders[i].Quantity;
  }
  const Hours = new Date().getHours();
  var Hour = Hours > 12 ? Hours - 12 : Hours
  var Minutes = new Date().getMinutes()
  
  
  useEffect(() => {
    const fetchdata = async () => {
      
      try {
        setloading(true);
        
        await axios.get(`${backendurl.url}cart`).then((res) => {
          
          setorders(res.data);
          setloading(false);
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchdata();
   
  }, [orders.length]);

  const handlecancel = async (i) => {
    document.getElementById(`${i}button`).outerHTML =
      "<div class=loadingicon-container><div></div></div>";
    await axios.post(`${backendurl.url}cart`, orders[i]).then((res) => {
    
      window.location.reload();
    });
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
  
    setpaynowclicked(true);
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = await fetch(`${backendurl.url}razorpay`, {
      method: "POST",
      body: JSON.stringify({
        amount: totalprice,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((t) => t.json());



    const options = {
      key: "rzp_test_vXL1PFj1Br25DV",
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: "Food House",
      description: data.id,

      handler: function (response) {
        // alert(response.razorpay_signature);
        setcurrentorderid(response.razorpay_order_id);
        setcurrentpaymentid(response.razorpay_payment_id);
        setcurrentamount(totalprice);
        const posttodayorder = async () => {
          await axios.post(`${backendurl.url}todayorders` , {
            Orderid : response.razorpay_order_id,
            Paymentid : response.razorpay_payment_id,
            Time : `${Hour}:${Minutes >= 10 ? Minutes : "0"+Minutes} ${Hours > 12 ? "PM" : "AM"}`,
            Order : orders,
            PhoneNumber : currentphonenumber,
            Amount : totalprice,
            Location : `${userlocation.Latitude} ${userlocation.Longitude}`,
            LocationLink : `https://www.google.com/maps/place/${userlocation.Latitude}+${userlocation.Longitude}`,
            DeliveryTime : `${Hour + 1}:${Minutes >= 10 ? Minutes : "0"+Minutes} ${Hours > 12 ? "PM" : "AM"}`,
            Completed : "25%"
          }).then(res => {
            
          })
        }
        posttodayorder();
        setpaid(true);
        setpaynowclicked(false);
      },
      prefill: {
        phone_number: "9899999999",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  return (
    <div className="confirm-orders-container">
      <Navbar color="black" credentials={true}  columns="auto auto auto auto" />
      {paid ? (
        <OrderPlaced
          orderid={currentorderid}
          paymentid={currentpaymentid}
          phonenumber={currentphonenumber}
          amount={currentamount}
          
        />
      ) : (
        <div>
          <p className="cart-title">Cart</p>
          {loading ? (
            <LoadingIcon />
          ) : orders.length > 0 ? (
            <div className="cart-items-container">
              {orders.map((order, index) => {
                return (
                  <div id={`${index}order`} key={index} className="cart-item">
                    <p className="order-name">{order.Name}</p>
                    <p>{order.Quantity}</p>
                    <p className="order-category">{order.Category}</p>
                    <p>{order.Price} /-</p>
                    <button
                      id={`${index}button`}
                      onClick={() => {
                        handlecancel(index);
                      }}
                    >
                      <CancelIcon />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyCartIcon />
          )}
          <div
            className="totalprice-container"
            style={{
              display: orders.length > 0 ? "block" : "none",
              opacity: paynowclicked ? 0.5 : 1,
            }}
          >
            <button
              className="App-link"
              onClick={displayRazorpay}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pay Now <p>{totalprice} /-</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
