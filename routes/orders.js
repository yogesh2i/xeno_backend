const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Customer = require("../models/Customer");

/*
* Post /api/orders
* Add a new order
*/
router.post("/", async (req, res) => {
  const { customerId, orderAmount } = req.body;

  if (!customerId || orderAmount == null) {
    return res.status(400).json({ error: "Customer ID and order amount are required." });
  }

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    const newOrder = new Order({ customerId, orderAmount });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/*
Get /api/orders
get all orders
*/
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("customerId", "name location");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;