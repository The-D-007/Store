"use strict";

const mysql = require("mysql2");

const allProvinceTaxes = {
  AB: 0.05,
  BC: 0.12,
  MB: 0.12,
  NB: 0.15,
  NL: 0.15,
  NS: 0.15,
  ON: 0.13,
  PE: 0.15,
  QC: 0.14,
  SK: 0.11,
  NT: 0.05,
  NU: 0.05,
  YT: 0.05,
};

const conn = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "customers",
  password: "assignment4",
  insecureAuth: true,
  database: "webassignment",
});

exports.getReceipt = (userDetails, cartItems) => {
  if (userDetails.name === undefined) {
    return;
  }
  if (cartItems.length === 0) {
    return;
  }
  let sum = 0;
  cartItems.forEach((element) => {
    sum += parseFloat(element.price);
  });
  const subTotal = sum;
  const tax = subTotal * allProvinceTaxes[userDetails.province];
  const total = subTotal + tax;

  try {
    conn.query(
      `INSERT INTO Orders 
             (name, address, city, province, phone, email, subTotal, tax, total) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        userDetails.name,
        userDetails.address,
        userDetails.city,
        userDetails.province,
        userDetails.phone,
        userDetails.email,
        subTotal,
        tax,
        total,
      ],
      (queryError, results) => {
        if (queryError) {
          console.error(`Insert Query Error: ${queryError}`);
          return;
        } else {
          const orderId = results.insertId;

          for (const item of cartItems) {
            conn.query(
              `INSERT INTO Items (orderId, name, price) VALUES (?, ?, ?);`,
              [orderId, item.name, item.price]
            );
          }
        }
      }
    );
  } catch (error) {
    console.error(`Insert Query Error: ${error}`);
  }

  return {
    customer: userDetails,
    items: cartItems,
    subTotal: subTotal,
    tax: tax,
    total: total,
  };
};

