const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const bodyParser = require('body-parser')
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const app = express();

mongoose.connect("mongodb+srv://admin-lokesh:Lokesh12@cluster0.pjroh.mongodb.net/FoodHouse?retryWrites=true&w=majority", {}).then(() => {
  console.log("Connection Established");
});

app.use(cookieparser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://food-house-bb357.web.app",
      "https://foodhouseapp.herokuapp.com",
      "https://food-house-admin.herokuapp.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json())

const razorpay = new Razorpay({
	key_id: 'rzp_test_vXL1PFj1Br25DV',
	key_secret: 'UC4aaccqd8BPOLvLa2qohWVL'
});

const UsersSchema = new mongoose.Schema({
  PhoneNumber: Number,
  Password: String,
});

const FoodSchema = {
  Name: String,
  Price: Number,
  Category: String,
  Image: String,
};

const OrderSchema = new mongoose.Schema({
  Name: String,
  Price: Number,
  Category: String,
  Quantity: Number,
});

const TodayOrdersSchema = new mongoose.Schema({
  Orderid : String,
  Paymentid : String,
  Time : String,
  Order : Array,
  PhoneNumber : String,
  Amount : String,
  Location : String,
  LocationLink : String,
  DeliveryTime : String,
  Completed : String
})

const Users = mongoose.model("Users", UsersSchema);
const Burgers = mongoose.model("Burgers", FoodSchema);
const TodayOrders = mongoose.model("TodayOrders" , TodayOrdersSchema)

app.get("/", (req, res) => {
  res.send("hello");
  console.log(process.env.URL);
});
app.post("/signup", (req, res) => {
  console.log(req.body);
  Users.find({ PhoneNumber: req.body.PhoneNumber }, (err, users) => {
    if (users.length === 0) {
      Users.insertMany(req.body, (err) => {
        if (err) {
          console.log(err);
        } else {
          res.cookie("userid", `${req.body.PhoneNumber}`, {
            sameSite: "none",
            secure: true,
            httpOnly: true,
            maxAge: 9000000,
          });
          
          res.send("Inserted")
          console.log("Inserted");
        }
      });
    } else {
      res.send("user found");
    }
  });
});
app.post("/login", (req, res) => {
  console.log(req.body);
  Users.find({ PhoneNumber: req.body.PhoneNumber }, (err, user) => {
    if (user.length === 0) {
      res.send("user not found");
    } else {
      if (req.body.Password === user[0].Password) {
        if (!req.cookies.userid) {
          res.cookie("userid", `${req.body.PhoneNumber}`, {
            sameSite: "none",
            secure: true,
            httpOnly: true,
            maxAge: 9000000,
          });
        }

        res.send("user found");
      } else {
        res.send("wrong password");
      }
    }
  });
});

app.post("/otpuser", (req, res) => {
  Users.find({ PhoneNumber: req.body.PhoneNumber }, (err, user) => {
    if (user.length === 0) {
      res.send("user not found");
    } else {
      console.log(req.body);
      res.cookie("userid", `${req.body.PhoneNumber}`, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        maxAge: 9000000,
      });
     res.send("user found")
      
    }
  });
});
app.post("/logout", (req, res) => {
  
  const cookievalues = Object.keys(req.cookies);
  const usercookie = cookievalues.filter(
    (cookie) => typeof cookie === "string"
  );
  res.cookie("userid", `${req.body.PhoneNumber}`, {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 0,
  });
  res.send("removed");
  
});
app.get("/loggedin", (req, res) => {
  const cookievalues = Object.values(req.cookies);
  const usercookie = cookievalues.filter(
    (cookie) => typeof cookie === "string"
  )
  if (req.cookies.userid) {
    res.send(usercookie);
  } else {
    res.send(false);
  }
});
app.post("/otp", (req, res) => {
  Users.find({ PhoneNumber: req.body.PhoneNumber }, (err, user) => {
    if (user.length === 0) {
      res.send("User not found");
    } else {
      res.send("user found");
    }
  });
});

app.post("/forgot", (req, res) => {
  Users.find({ PhoneNumber: req.body.PhoneNumber }, (err, user) => {
    if (user.length === 0) {
      res.send("No user found");
    } else {
      res.send("user found");
    }
  });
});

app.post("/changepassword", (req, res) => {
  Users.find({ PhoneNumber: req.body.PhoneNumber }, (err, user) => {
    if (user.length === 0) {
      res.send("No user found");
    } else {
      Users.updateOne(
        { PhoneNumber: req.body.PhoneNumber },
        { $set: { Password: req.body.Password } },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("changed");
          }
        }
      );
    }
  });
});

app.get("/burgers", (req, res) => {
  Burgers.find({}, (err, burgers) => {
    if (err) {
      console.log(err);
    } else {
      res.send(burgers);
    }
  });
});

app.post("/orders", (req, res) => {
  const items = req.body;
  const cookietitles = Object.keys(req.cookies);
  const cookiestoremove = cookietitles.filter(
    (title) => title.substring(0, 4) === "item"
  );

  cookiestoremove.map((title) => res.clearCookie(title));

  items.map((item, index) => {
    return res.cookie(
      `item${index}`,
      {
        Name: item.Name,
        Price: item.Price,
        Quantity: item.Quantity,
        Category: item.Category,
      },
      {
        sameSite: "none",
        secure: true,
        maxAge: 9000000,
      }
    );
  });

  const cookievalues = Object.values(req.cookies);
  const usercookie = cookievalues.filter(
    (cookie) => typeof cookie === "string"
  );

  const orders = mongoose.model(`${usercookie}orders`, OrderSchema);
  orders.insertMany(req.body, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send("inserted");
    }
  });
});

app.get("/cart", (req, res) => {
  const cookies = Object.values(req.cookies);
  const cookievalues = Object.values(req.cookies);
  const usercookie = cookievalues.filter(
    (cookie) => typeof cookie === "string"
  );

  const orders = mongoose.model(`${usercookie}orders`, OrderSchema);
  const cookiestosend = cookies.filter((cookie) => typeof cookie === "object");
  orders.find({}, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

app.post("/cart", (req, res) => {
  const cookievalues = Object.values(req.cookies);
  const usercookie = cookievalues.filter(
    (cookie) => typeof cookie === "string"
  );
  const orders = mongoose.model(`${usercookie}orders`, OrderSchema);
  orders.deleteOne({ _id: req.body._id }, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send("deleted");
    }
  });
});
app.get('/logo.svg', (req, res) => {
	res.sendFile(path.join(__dirname, 'Logo.svg'))
})
app.post('/verification', (req, res) => {
	// do a validation
	const secret = '12345678'



	const crypto = require('crypto');

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

app.post('/razorpay', async (req, res) => {
	const payment_capture = 1
	const amount = parseInt(req.body.amount)
	const currency = 'INR'

	const options = 
  {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})

app.post('/todayorders' , (req,res) => {
  
  TodayOrders.insertMany(req.body , (err,result) => {
    if(err){
      console.log(err);
    }else{
      res.send("Order Placed")
    }
  });
  const cookievalues = Object.values(req.cookies);
  const usercookie = cookievalues.filter(
    (cookie) => typeof cookie === "string"
  );
  const todayorders = req.body.Order;
  const orders = mongoose.model(`${usercookie}orders`, OrderSchema);
 todayorders.map((orderid) => {
   return orders.deleteOne({Orderid : orderid} , (err,result) => {
     if(err){
       console.log(err);
     }else{
       console.log(result);
     }
   })
 })
})

app.get('/todayorders' , (req,res) => {
  TodayOrders.find({} , (err,results) => {
    if(err){
      console.log(err);
    }else{
      res.send(results)
    }
  })
})

app.post("/deleteorder" , (req,res) => {
  
  TodayOrders.deleteOne({Orderid : req.body.Orderid} , (err,result) => {
    if(err){
      console.log(err);
    }else{
      res.send("deleted");
    }
  })
})

app.post('/updateorders' , (req,res) => {
  console.log(req.body);
  TodayOrders.updateOne(
    { Orderid: req.body.Orderid },
    { $set: { DeliveryTime: req.body.Deliverytime,Completed : req.body.Completion } },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("changed");
      }
    }
  );
})

app.listen(process.env.PORT || 5000, () => {
  console.log("Server Started");
});
