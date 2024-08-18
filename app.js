"use strict";

const { error } = require("console");

const express = require("express"),
  app = express(),
  path = require('path'),
  session = require('express-session'),
  validator = require('express-validator'),
  check = validator.check,
  validationResult = validator.validationResult,
  bodyParser = require("body-parser"),
  order = require("./controller/orderController"),
  receiptMaker = require("./controller/receiptController");

app.set("port", process.env.PORT || 8000);
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:false}));
app.use(express.json());


let userDetails = {};

app.get("/", (req, res) => {
  res.render("index", { receipt: undefined });
});

app.post("/", (req, res) => {
  userDetails = req.body;
  let phoneRegex = /^\d{10}$/;
  if (!userDetails.phone.match(phoneRegex)) {
    res.json({userDetails: undefined });
    return;
  }
  res.json({userDetails: userDetails });
});

app.post("/checkout", (req, res) => {
  const cartItems = req.body.cartItems;
  const receipt = receiptMaker.getReceipt(userDetails, cartItems);
  if (receipt === undefined) {
    res.render("index", { receipt: "Please choose at least one item." });
    return
  }
  res.render("index", { receipt: receipt });
});

app.get("/allOrders", order.allOrderDetails);

app.listen(app.get("port"), () => {
  console.log("Server is running on port", app.get("port"));
});
