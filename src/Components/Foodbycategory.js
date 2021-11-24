import axios from "axios";
import React, { useEffect, useState } from "react";
import Addtocart from "../Icons/Addtocart";
import Removecart from "../Icons/Removecart";
import Navbar from "./Navbar";
import {  useNavigate } from "react-router-dom";
import LoadingIcon from "../Icons/Loading";
import { backendurl } from "../url";

export default function Foodbycategory(props) {
  document.querySelector("body").style.backgroundColor = "white";
  const navigate = useNavigate();
  const [foods, setfoods] = useState([]);
  const [loading, setloading] = useState(false);
  const [dataparsed, setdataparsed] = useState(false);
  const [selecteditems, setselecteditems] = useState([]);
  const finalitems = [];
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get(`${backendurl.url}loggedin`).then((res) => {
      
      if (!res.data) {
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 10);
      }
    });
  },[navigate]);
  

  useEffect(() => {
    const fetchdata = async () => {
      setdataparsed(true);
      await axios.get(`${backendurl.url}${props.food}`).then((res) => {
        setfoods(res.data);
        setdataparsed(false);
      });
    }
    fetchdata();
  }, [props.food]);

  const handleaddtocart = (index) => {
    document.getElementById(`${index}itemcount`).style.display = "";
    document.getElementById(`${index}removecart`).style.display = "";
    
    const input = document.getElementById(`${index}itemcount`);
    input.value = Number(input.value) + 1
    setselecteditems((prev) => {
      return [...prev, foods[index]];
    });
  };
  axios.defaults.withCredentials = true;
  const handleremovecart = (index) => {
    const currentvalue = document.getElementById(`${index}itemcount`).value;
    if (currentvalue <= 1) {
      document.getElementById(`${index}itemcount`).style.display = "none";
      document.getElementById(`${index}removecart`).style.display = "none";
    }

    const input = document.getElementById(`${index}itemcount`);
    input.value = Number(input.value) - 1

    const indexofelement = selecteditems.indexOf(foods[index]);
    selecteditems.splice(indexofelement, 1);
  };

  const postorders = async () => {
    setloading(true);
    await axios.post(`${backendurl.url}orders`, finalitems).then((res) => {
     
      navigate("/cart");
    });
    setloading(false);
  };

  const handlesubmit = () => {
    
    for (let i = 0; i < foods.length; i++) {
      const results = selecteditems.filter(
        (item) => item.Name === foods[i].Name
      );

      const finalitem = {
        Name: foods[i].Name,
        Price: foods[i].Price,
        Category: foods[i].Category,
        Quantity: results.length,
      };
      if (finalitem.Quantity) {
        finalitems.push(finalitem);
      }
    }
    postorders();
  };

  return (
  
      <div className="foodbycategory-container">
        <Navbar color="black" credentials={true} columns="auto auto auto auto" />
        <p className="food-title">{props.title}</p>
        <br />
        {dataparsed ? (
          <LoadingIcon width="100px" height="100px" margintop="100px"  />
        ) : (
          <div className="burgers">
            {foods.map((food, index) => {
              return (
                <div key={index} className="burger" id={`${index}burger`}>
                  <img src={food.Image} alt="burger" />
                  <div className="burger-detail-addtocart">
                    <div className="burger-detail">
                      <p className="title">{food.Name}</p>
                      <p style={{ fontWeight: "bolder" }}>{food.Price}/-</p>
                    </div>
                    <div className="addtocart">
                      <p
                        onClick={() => {
                          handleaddtocart(index);
                        }}
                        id={`${index}addtocart`}
                      >
                        <Addtocart />
                      </p>

                      <div>
                        <input
                          style={{ display: "none" }}
                          id={`${index}itemcount`}
                          type="number"
                          
                     step="1" min="0" max="10"
                        />
                        <h3
                          style={{ display: "none" }}
                          id={`${index}itemcount`}
                        >
                          0
                        </h3>
                        <p
                          style={{ display: "none" }}
                          id={`${index}removecart`}
                          onClick={() => {
                            handleremovecart(index);
                          }}
                        >
                          <Removecart />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <button onClick={handlesubmit}>
          {loading ? <LoadingIcon /> : "Add to Cart"}
        </button>
      </div>
    
  );
}
