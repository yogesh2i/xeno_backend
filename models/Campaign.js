const mongoose = require("mongoose");


const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  segmentName: { type: String, required: true },
  audienceSegment: [
    {
      field: { type: String, required: true },
      operator: { type: String, required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true },
      logic: { type: String, enum: ["AND", "OR"], required: true },
    },
  ],
  audienceSize: { type: Number, required: true },
  sent: { type: Number, required: true },
  failed: { type: Number, required: true },
  tag: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", campaignSchema);
