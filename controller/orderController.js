"use strict";

const mysql = require("mysql2");
const conn = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "customers",
  password: "assignment4",
  insecureAuth: true,
  database: "webassignment",
});

exports.allOrderDetails = (req, res) => {
  const query = `
    SELECT orders.*, COUNT(items.Name) AS itemCount 
    FROM orders 
    INNER JOIN items ON orders.OrderID = items.OrderID 
    GROUP BY orders.OrderID;
  `;

  conn.query(query, (queryError, ordersResults) => {
    if (queryError) {
      console.log(`Select Query Error: ${queryError}`);
      res.status(500).send("Error fetching orders");
    } else {
      res.render("allOrders", {
        orders: ordersResults,
      });
    }
  });
};
