const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

/**
 * POST /api/delivery-receipt
 * Log delivery status to a file.
 */
router.post("/", async (req, res) => {
  const { customerId, campaignName, status, message } = req.body;

  if (!customerId || !campaignName || !status || !message) {
    return res.status(400).json({ error: "Invalid delivery receipt data." });
  }

  try {
    // Create a log entry
    const logEntry = {
      customerId,
      campaignName,
      status,
      message,
      timestamp: new Date().toISOString(),
    };

    // Define the log file path
    const logFilePath = path.join(__dirname, "../logs/communication_log.txt");

    // Append the log entry to the file
    fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
          return res.status(500).json({ error: "Failed to log delivery receipt." });
        }
      });
    res.status(200).json({ message: "Delivery receipt logged successfully." });
  } catch (error) {
    console.error("Error logging delivery receipt:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;