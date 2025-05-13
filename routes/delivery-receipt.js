const express = require("express");
const fs = require("fs");
const path = require("path");
const Log = require("../models/Log");
const router = express.Router();

/**
 * POST /api/delivery-receipt
 * Log delivery status to a file.
 */
router.post("/", async (req, res) => {
  const {  campaignName, sent,failed} = req.body;

  if ( !campaignName) {
    return res.status(400).json({ error: "Invalid delivery receipt data." });
  }

  try {
    // Create a log entry
    const logEntry =  new Log({
      campaignName,
      sent,
      failed,
      timestamp: new Date().toISOString(),
    });
    
    
     await logEntry.save();
    res.status(201).json({ message: "Delivery receipt logged successfully." });
  } catch (error) {
    console.error("Error logging delivery receipt:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;