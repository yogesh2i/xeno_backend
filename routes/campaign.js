const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");
const axios = require("axios");

/**
 * GET /api/campaigns
 * Fetch all campaigns.
 */
router.get("/", async (req, res) => {
    try {
      const campaigns = await Campaign.find().sort({ createdAt: -1 });
      res.status(200).json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

/*
* POST /api/campaigns
* Add a campaign
*/
router.post("/", async (req, res) => {
   
  const { name, segmentName, rules } = req.body;
  if (!name || !segmentName || !rules || !Array.isArray(rules) || rules.length === 0) {
    return res.status(400).json({ error: "Invalid campaign data." });
  }

  try {
   
    const andConditions = [];
    const orConditions = [];

    rules.forEach((rule) => {
      const { field, operator, value, logic } = rule;

     
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

     
      const condition = { [field]: { [mongoOperator]: value } };

  
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
    const customers = await Customer.find(query);

    // Simulate sending messages
    const sent = [];
    const failed = [];

    for (const customer of customers) {
      const isSuccess = Math.random() < 0.9; // 90% success rate
      const message = `Hi ${customer.name}, here’s 10% off on your next order!`;

      if (isSuccess) {
        sent.push(customer._id);
      } else {
        failed.push(customer._id);
      }

      // Simulate  dummy vendor API and logging
      await axios.post(`${process.env.SERVER_URL}/delivery-receipt`, {
        customerId: customer._id,
        campaignName: segmentName, 
        status: isSuccess ? "SENT" : "FAILED",
        message,
      });
    }
    const campaign = {
        name,
        segmentName,
        audienceSegment: rules,
        audienceSize: customers.length,
        sent: sent.length,
        failed: failed.length,
        tag: ""
    }
    //generate auto tag using AI
    const aiResponse = await axios.post(`${process.env.SERVER_URL}/ai/generate-insight`, campaign);
    const insight = aiResponse.data.tag=="Error"?"":aiResponse.data.tag;
    campaign.tag = insight;
    const newCampaign = new Campaign(campaign);
    
    
    // Save the campaign to the database
    await newCampaign.save();

  

    res.status(201).json({
      message: "Campaign saved successfully.",
      campaign: newCampaign, // Returning actual campaign object
    });
  } catch (error) {
    console.error("Error saving campaign:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;