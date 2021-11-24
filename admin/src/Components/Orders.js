import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendurl } from "../url";
import LoadingIcon from "../Icons/Loading";
import NewTabIcon from "../Icons/NewTabIcon";
import CancelIcon from "../Icons/CancelIcon";

export default function Orders() {
  const [loading, setloading] = useState(false);
  const [orders, setorders] = useState([]);
  const [deliverytime, setdeliverytime] = useState(String);
  const [completion, setcompletion] = useState(String);
  const [loading1, setloading1] = useState(false);

  const getorders = async () => {
    setloading(true);
    await axios.get(`${backendurl.url}todayorders`).then((res) => {
      console.log(res.data);
      setorders(res.data);

      setloading(false);
    });
  };

  useEffect(() => {
    getorders();
  }, []);

  const handleupdate = (index) => {
    document.getElementById(`${index}order`).style.display = "none";
    document.getElementById(`${index}update`).style.display = "";
  };
  const handletime = (e) => {
    const value = e.target.value;
    setdeliverytime(value);
  };
  const handlecompletion = (e) => {
    const value = e.target.value;
    setcompletion(value);
  };

  const handlesubmit = async (orderid, index) => {
    if (completion.length === 0 && deliverytime.length === 0) {
      alert("Input Required !");
    } else {
      setloading1(true);
      await axios
        .post(`${backendurl.url}updateorders`, {
          Orderid: orderid,
          Deliverytime: deliverytime,
          Completion: completion,
        })
        .then((res) => {
          if (res.data === "changed") {
            document.getElementById(`${index}order`).style.display = "";
            document.getElementById(`${index}update`).style.display = "none";
            setloading1(false);
          }
        });
    }
  };

  const handlevieworder = (index) => {
    document.getElementById(`${index}order`).style.display = "none";
    document.getElementById(`${index}item`).style.display = "";
  };

  const handlecancelvieworder = (index) => {
    document.getElementById(`${index}order`).style.display = "";
    document.getElementById(`${index}item`).style.display = "none";
  };
  const handlecancelvieworder1 = (index) => {
    document.getElementById(`${index}update`).style.display = "none";
    document.getElementById(`${index}order`).style.display = "";
  };

  const handledelete = async (orderid, index) => {
    document.getElementById(`${index}delete`).innerText = "Deleting";
    await axios
      .post(`${backendurl.url}deleteorder`, {
        Orderid: orderid,
      })
      .then((res) => {
        if (res.data === "deleted") {
          window.location.reload();
        }
      });
  };

  return (
    <div className="orders-container">
      <h1>
        Today Orders<p>{orders.length}</p>
      </h1>

      {loading ? (
        <LoadingIcon width="180px" height="180px" margintop="100px" />
      ) : orders.length === 0 ? (
        <h1 className="noorder">No Orders yet !</h1>
      ) : (
        <div className="today-orders">
          {orders.map((order, index) => {
            return (
              <div key={index}>
                <div key={index} className="order" id={`${index}order`}>
                  <p className="orderidtitle">Order Id</p>
                  <p className="id">{order.Orderid}</p>
                  <p className="orderidtitle">Phone Number</p>
                  <p className="id">{order.PhoneNumber}</p>
                  <p className="orderidtitle">Time</p>
                  <p className="id">{order.Time}</p>
                  <p className="orderidtitle">Location</p>
                  <a
                    href={`${order.LocationLink}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps
                    <NewTabIcon />
                  </a>
                  <p className="orderidtitle">Order</p>
                  <p
                    onClick={() => {
                      handlevieworder(index);
                    }}
                    className="vieworder"
                  >
                    View Orders
                  </p>

                  <button
                    onClick={() => {
                      handleupdate(index);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="delete"
                    onClick={() => {
                      handledelete(order.Orderid, index);
                    }}
                    style={{ opacity: loading1 ? 0.5 : 1 }}
                    id={`${index}delete`}
                  >
                    Delete
                  </button>
                </div>
                <div
                  className="order"
                  id={`${index}update`}
                  style={{ display: "none" }}
                >
                  <input
                    type="text"
                    onChange={handletime}
                    placeholder="Estimated Delivery Time"
                  />
                  <br />
                  <input
                    type="text"
                    onChange={handlecompletion}
                    placeholder="Completion in %"
                  />
                  <br />
                  <button
                    onClick={() => {
                      handlesubmit(order.Orderid, index);
                    }}
                    style={{ opacity: loading1 ? 0.5 : 1 }}
                  >
                    {loading1 ? "Submitting" : "Submit"}
                  </button>
                  <button
                    className="cancelicon"
                    onClick={() => {
                      handlecancelvieworder1(index);
                    }}
                  >
                    <CancelIcon />
                  </button>
                </div>
                <div
                  className="order"
                  id={`${index}item`}
                  style={{ display: "none"}}
                >
                  <div style={{height:"200px",overflow:"scroll" }}>
                  {order.Order.map((item, index) => {
                    return (
                      
                      <p key={index} className="id" id="item">
                        {item.Name} &nbsp;
                        <p
                          style={{ color: "#e7a422" }}
                        >{`(${item.Quantity})`}</p>
                      </p>
                     
                    );
                  })}
                   </div>
                  <button
                    className="cancelicon"
                    onClick={() => {
                      handlecancelvieworder(index);
                    }}
                  >
                    <CancelIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
