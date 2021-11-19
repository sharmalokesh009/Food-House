import React from "react";
import OrderPlacedIcon from "../Icons/OrderPlacedIcon";
import TrackOrder from "../Icons/TrackIcon";
import { Link } from "react-router-dom";

export default function OrderPlaced(props){

    document.querySelector("body").style.backgroundColor = "white";

    return <div className="orderplaced-container">
       
        <div className="orderplaced">
        <p>Your Order has been Placed</p>
       <OrderPlacedIcon/>
        </div>
        <div className="order-details">
            <p>Order Details</p>
            <br/>
            <div>
                <p className="details-titles">Order Id</p>
                <p style={{width:"10px"}}>:</p>
                <p className="orderid">{props.orderid}</p>
            </div>
            <div>
                <p className="details-titles">Payment Id</p>
                <p style={{width:"10px"}}>:</p>
                <p className="orderid">{props.paymentid}</p>
            </div>
            <div>
                <p className="details-titles">Phone Number</p>
                <p style={{width:"10px"}}>:</p>
                <p className="orderid">{props.phonenumber}</p>
            </div>
            <div>
                <p className="details-titles">Amount</p>
                <p style={{width:"10px"}}>:</p>
                <p className="orderid">{props.amount} /-</p>
            </div>
            
            <Link to={`/${props.orderid}`} >Track Order<TrackOrder/></Link>
        </div>
    </div>
}