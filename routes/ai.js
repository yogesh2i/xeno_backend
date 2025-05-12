const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require ("@google/genai");
require('dotenv').config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


/**
 * POST /api/ai/generate-insight
 * Generate AI tags for a campaign.
 */
router.post("/generate-insight", async (req, res) => {
  const { name, audienceSize, sent, failed, audienceSegment:rules } = req.body;

  try {
   
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        //prompt to generate tag based on campaign details
        contents: `
            Use AI to label campaigns  based on
    audience and message failed, sent.
            - Campaign Name: ${name}
            - Audience Size: ${audienceSize}
            - Messages Sent: ${sent}
            - Messages Failed: ${failed}
            - Rules: ${JSON.stringify(rules)}
            Give it a tag like for only one or two words tag by the analyzing the audience size, sent, failed, rules relation and output only that tag.
            Example: "Win-back", "High Value Customers", "Low Value Customers", "High Spenders", "Loyal Customers", "At Risk Customers", "New Customers", "Inactive Customers", "Churned Customers", "Engaged Customers", "Unengaged Customers"
          `,
      });
    res.status(200).json({ tag: response.text.trim()}); //removing \n  using trim

  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ error: "Failed to generate insights." });
  }
});

module.exports = router;