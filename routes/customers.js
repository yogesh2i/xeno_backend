const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

/**
 * POST /api/customers/filter
 * Fetch customers based on filters and return data in campaign format.
 */
router.post("/filter", async (req, res) => {
  const rules  = req.body;
  if (!rules || !Array.isArray(rules) || rules.length === 0) {
    return res.status(400).json({ error: "Invalid request data." });
  }

  try {
    // Separate rules into groups based on AND/OR logic
    const andConditions = [];
    const orConditions = [];

    rules.forEach((rule) => {
      const { field, operator, value, logic } = rule;

      // Map operators to MongoDB query operators
      const mongoOperator = {
        ">": "$gt",
        "<": "$lt",
        "=": "$eq",
        ">=": "$gte",
        "<=": "$lte",
      }[operator];

      if (!mongoOperator) {
        throw new Error(`Invalid operator: ${operator}`);
      }

      // Create the condition
      const condition = { [field]: { [mongoOperator]: value } };

      // Add the condition to the appropriate group (AND/OR)
      if (logic === "OR") {
        orConditions.push(condition);
      } else {
        andConditions.push(condition);
      }
    });

    // Build the final query
    let query = {};
    if (orConditions.length > 0) {
      query["$or"] = orConditions;
    }
    if (andConditions.length > 0) {
      query["$and"] = andConditions;
    }

    // Fetch customers from the database
    const customers = await Customer.find(query).lean();

    // Return the audience size
    res.status(200).json({ audienceSize: customers.length });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/*
* POST /api/customers
* add a new customer
*/
router.post("/", async (req, res) => {
  const { name, location, spentAmount, inactiveDays, age } = req.body;

  if (!name || !location || spentAmount == null || inactiveDays == null || age == null) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newCustomer = new Customer({ name, location, spentAmount, inactiveDays, age });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/*
* GET /api/customers
* get all customers
*/
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;